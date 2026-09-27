package com.hiresmart.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.hiresmart.dto.ApplicantResponse;
import com.hiresmart.dto.ApplicationResponse;
import com.hiresmart.entity.ATSResult;
import com.hiresmart.entity.Application;
import com.hiresmart.entity.Job;
import com.hiresmart.entity.Resume;
import com.hiresmart.entity.User;
import com.hiresmart.exception.ApplicationAlreadyExistsException;
import com.hiresmart.repository.ATSResultRepository;
import com.hiresmart.repository.ApplicationRepository;
import com.hiresmart.repository.JobRepository;
import com.hiresmart.repository.ResumeRepository;
import com.hiresmart.repository.UserRepository;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ATSResultRepository atsResultRepository;
    private final ResumeRepository resumeRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            JobRepository jobRepository,
            UserRepository userRepository,
            ATSResultRepository atsResultRepository,
            ResumeRepository resumeRepository) {

        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.atsResultRepository = atsResultRepository;
        this.resumeRepository = resumeRepository;
    }

    // ========================================
    // APPLY FOR JOB
    // ========================================

    public ApplicationResponse applyForJob(Long jobId) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Candidate not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() ->
                        new RuntimeException("Job not found"));

        if (applicationRepository.existsByCandidateIdAndJobId(
                candidate.getId(), job.getId())) {

            throw new ApplicationAlreadyExistsException(
                    "You have already applied for this job");
        }

        Application application = new Application();

        application.setCandidate(candidate);
        application.setJob(job);
        application.setStatus("APPLIED");

        Application savedApplication =
                applicationRepository.save(application);

        ApplicationResponse response =
                new ApplicationResponse();

        response.setId(savedApplication.getId());
        response.setJobId(job.getId());
        response.setJobTitle(job.getTitle());
        response.setCompany(job.getCompany());
        response.setStatus(savedApplication.getStatus());

        return response;
    }

    // ========================================
    // GET MY APPLICATIONS
    // ========================================

    public List<ApplicationResponse> getMyApplications() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Candidate not found"));

        List<Application> applications =
                applicationRepository.findByCandidateId(
                        candidate.getId());

        List<ApplicationResponse> responses =
                new ArrayList<>();

        for (Application application : applications) {

            ApplicationResponse response =
                    new ApplicationResponse();

            response.setId(application.getId());
            response.setJobId(
                    application.getJob().getId());
            response.setJobTitle(
                    application.getJob().getTitle());
            response.setCompany(
                    application.getJob().getCompany());
            response.setStatus(
                    application.getStatus());

            // Get ATS score for this application
            Resume resume = resumeRepository
                    .findFirstByCandidateIdOrderByIdDesc(
                            candidate.getId())
                    .orElse(null);

            if (resume != null) {

                ATSResult atsResult =
                        atsResultRepository
                                .findByResumeIdAndJobId(
                                        resume.getId(),
                                        application.getJob().getId())
                                .orElse(null);

                if (atsResult != null) {

                    response.setAtsScore(
                            atsResult.getMatchScore());
                }
            }

            responses.add(response);
        }

        return responses;
    }

    // ========================================
    // GET APPLICANTS FOR RECRUITER
    // ========================================

    public List<ApplicantResponse> getRecruiterApplicants() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));

        List<Application> applications =
                applicationRepository.findByJobRecruiterId(
                        recruiter.getId());

        List<ApplicantResponse> responses =
                new ArrayList<>();

        for (Application application : applications) {

            ApplicantResponse response =
                    new ApplicantResponse();

            response.setApplicationId(
                    application.getId());

            response.setCandidateId(
                    application.getCandidate().getId());

            response.setCandidateName(
                    application.getCandidate().getName());

            response.setCandidateEmail(
                    application.getCandidate().getEmail());

            response.setJobId(
                    application.getJob().getId());

            response.setJobTitle(
                    application.getJob().getTitle());

            response.setStatus(
                    application.getStatus());

            // ========================================
            // GET ATS SCORE
            // ========================================

            Resume resume = resumeRepository
                    .findFirstByCandidateIdOrderByIdDesc(
                            application.getCandidate().getId())
                    .orElse(null);

            if (resume != null) {

                ATSResult atsResult =
                        atsResultRepository
                                .findByResumeIdAndJobId(
                                        resume.getId(),
                                        application.getJob().getId())
                                .orElse(null);

                if (atsResult != null) {

                    response.setAtsScore(
                            atsResult.getMatchScore());
                }
            }

            responses.add(response);
        }

        return responses;
    }

    // ========================================
    // UPDATE APPLICATION STATUS
    // ========================================

    public ApplicationResponse updateApplicationStatus(
            Long applicationId,
            String status) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Recruiter not found"));

        Application application =
                applicationRepository.findByIdAndJobRecruiterId(
                        applicationId,
                        recruiter.getId());

        if (application == null) {

            throw new RuntimeException(
                    "Application not found or you do not own this job");
        }

        if (!status.equals("APPLIED")
                && !status.equals("SHORTLISTED")
                && !status.equals("REJECTED")) {

            throw new RuntimeException(
                    "Invalid application status");
        }

        application.setStatus(status);

        Application savedApplication =
                applicationRepository.save(application);

        ApplicationResponse response =
                new ApplicationResponse();

        response.setId(savedApplication.getId());
        response.setJobId(
                application.getJob().getId());
        response.setJobTitle(
                application.getJob().getTitle());
        response.setCompany(
                application.getJob().getCompany());
        response.setStatus(
                savedApplication.getStatus());

        return response;
    }
}