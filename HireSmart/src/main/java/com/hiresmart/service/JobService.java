package com.hiresmart.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.hiresmart.dto.JobRequest;
import com.hiresmart.dto.JobResponse;
import com.hiresmart.entity.Job;
import com.hiresmart.entity.User;
import com.hiresmart.exception.JobNotFoundException;
import com.hiresmart.repository.JobRepository;
import com.hiresmart.repository.UserRepository;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobService(
            JobRepository jobRepository,
            UserRepository userRepository) {

        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    // ========================================
    // GET LOGGED-IN RECRUITER
    // ========================================

    private User getLoggedInRecruiter() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Recruiter not found"));
    }

    // ========================================
    // CREATE JOB
    // ========================================

    public JobResponse createJob(JobRequest request) {

        User recruiter = getLoggedInRecruiter();

        Job job = new Job();

        job.setRecruiter(recruiter);
        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setExperience(request.getExperience());
        job.setSalary(request.getSalary());
        job.setSkills(request.getSkills());
        job.setDescription(request.getDescription());

        Job savedJob =
                jobRepository.save(job);

        return convertToResponse(savedJob);
    }

    // ========================================
    // GET ALL JOBS
    // ========================================

    public List<JobResponse> getAllJobs() {

        List<Job> jobs =
                jobRepository.findAll();

        List<JobResponse> responses =
                new ArrayList<>();

        for (Job job : jobs) {

            responses.add(
                    convertToResponse(job));
        }

        return responses;
    }

    // ========================================
    // GET MY JOBS
    // ========================================

    public List<JobResponse> getMyJobs() {

        User recruiter =
                getLoggedInRecruiter();

        List<Job> jobs =
                jobRepository.findByRecruiterId(
                        recruiter.getId());

        List<JobResponse> responses =
                new ArrayList<>();

        for (Job job : jobs) {

            responses.add(
                    convertToResponse(job));
        }

        return responses;
    }

    // ========================================
    // UPDATE JOB
    // ========================================

    public JobResponse updateJob(
            Long id,
            JobRequest request) {

        Job job =
                jobRepository.findById(id)
                        .orElseThrow(() ->
                                new JobNotFoundException(
                                        "Job not found"));

        User recruiter =
                getLoggedInRecruiter();

        if (!job.getRecruiter()
                .getId()
                .equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You can update only your own jobs");
        }

        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setLocation(request.getLocation());
        job.setExperience(request.getExperience());
        job.setSalary(request.getSalary());
        job.setSkills(request.getSkills());
        job.setDescription(request.getDescription());

        Job updatedJob =
                jobRepository.save(job);

        return convertToResponse(updatedJob);
    }

    // ========================================
    // DELETE JOB
    // ========================================

    public void deleteJob(Long id) {

        Job job =
                jobRepository.findById(id)
                        .orElseThrow(() ->
                                new JobNotFoundException(
                                        "Job not found"));

        User recruiter =
                getLoggedInRecruiter();

        if (!job.getRecruiter()
                .getId()
                .equals(recruiter.getId())) {

            throw new RuntimeException(
                    "You can delete only your own jobs");
        }

        jobRepository.delete(job);
    }

    // ========================================
    // GET JOB BY ID
    // ========================================

    public JobResponse getJobById(Long id) {

        Job job =
                jobRepository.findById(id)
                        .orElseThrow(() ->
                                new JobNotFoundException(
                                        "Job not found"));

        return convertToResponse(job);
    }

    // ========================================
    // CONVERT JOB TO RESPONSE
    // ========================================

    private JobResponse convertToResponse(Job job) {

        JobResponse response =
                new JobResponse();

        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setCompany(job.getCompany());
        response.setLocation(job.getLocation());
        response.setExperience(job.getExperience());
        response.setSalary(job.getSalary());
        response.setSkills(job.getSkills());
        response.setDescription(job.getDescription());

        return response;
    }
}