package com.hiresmart.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.hiresmart.dto.ATSAnalysisResponse;
import com.hiresmart.entity.ATSResult;
import com.hiresmart.entity.Job;
import com.hiresmart.entity.Resume;
import com.hiresmart.entity.User;
import com.hiresmart.repository.ATSResultRepository;
import com.hiresmart.repository.JobRepository;
import com.hiresmart.repository.ResumeRepository;
import com.hiresmart.repository.UserRepository;

@Service
public class ATSService {

    private final ATSResultRepository atsResultRepository;
    private final ResumeRepository resumeRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ATSService(
            ATSResultRepository atsResultRepository,
            ResumeRepository resumeRepository,
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.atsResultRepository = atsResultRepository;
        this.resumeRepository = resumeRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public ATSAnalysisResponse analyzeResume(Long jobId) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Candidate not found"));

        Resume resume = resumeRepository
                .findFirstByCandidateIdOrderByIdDesc(candidate.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Please upload your resume first"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Job not found"));

        String resumeText = resume.getResumeText();

        if (resumeText == null || resumeText.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Resume text could not be extracted");
        }

        String jobSkills = job.getSkills();

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        if (jobSkills != null && !jobSkills.isBlank()) {

            String[] skills = jobSkills.split(",");

            for (String skill : skills) {

                String cleanSkill = skill.trim();

                if (cleanSkill.isEmpty()) {
                    continue;
                }

                if (resumeText.toLowerCase()
                        .contains(cleanSkill.toLowerCase())) {

                    matchedSkills.add(cleanSkill);

                } else {

                    missingSkills.add(cleanSkill);
                }
            }
        }

        int totalSkills = matchedSkills.size() + missingSkills.size();

        double matchScore = totalSkills == 0
                ? 0
                : ((double) matchedSkills.size() / totalSkills) * 100;

        String matched = String.join(", ", matchedSkills);
        String missing = String.join(", ", missingSkills);

        String summary;

        if (missingSkills.isEmpty()) {

            summary = "Your resume contains all the required skills for this job.";

        } else {

            summary = "Your resume matches "
                    + matchedSkills.size()
                    + " out of "
                    + totalSkills
                    + " required skills.";
        }

        ATSResult result = atsResultRepository
                .findByResumeIdAndJobId(resume.getId(), job.getId())
                .orElse(new ATSResult());

        result.setResumeId(resume.getId());
        result.setJobId(job.getId());
        result.setMatchScore(matchScore);
        result.setMatchedSkills(matched);
        result.setMissingSkills(missing);
        result.setSummary(summary);
        result.setCreatedAt(LocalDateTime.now());

        atsResultRepository.save(result);

        ATSAnalysisResponse response = new ATSAnalysisResponse();

        response.setMatchScore(matchScore);
        response.setMatchedSkills(matched);
        response.setMissingSkills(missing);
        response.setSummary(summary);

        return response;
    }

    public ATSAnalysisResponse getATSResult(Long jobId) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Candidate not found"));

        Resume resume = resumeRepository
                .findFirstByCandidateIdOrderByIdDesc(candidate.getId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Please upload your resume first"));

        ATSResult result = atsResultRepository
                .findByResumeIdAndJobId(resume.getId(), jobId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "ATS analysis not found. Analyze the resume first."));

        ATSAnalysisResponse response = new ATSAnalysisResponse();

        response.setMatchScore(result.getMatchScore());
        response.setMatchedSkills(result.getMatchedSkills());
        response.setMissingSkills(result.getMissingSkills());
        response.setSummary(result.getSummary());

        return response;
    }
}