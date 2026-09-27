package com.hiresmart.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hiresmart.dto.JobRequest;
import com.hiresmart.dto.JobResponse;
import com.hiresmart.service.JobService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/recruiter/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    // ========================================
    // CREATE JOB
    // ========================================

    @PostMapping
    public JobResponse createJob(
            @Valid @RequestBody JobRequest request) {

        return jobService.createJob(request);
    }

    // ========================================
    // GET ALL JOBS
    // ========================================

    @GetMapping
    public List<JobResponse> getAllJobs() {

        return jobService.getAllJobs();
    }

    // ========================================
    // GET MY JOBS
    // ========================================

    @GetMapping("/my")
    public List<JobResponse> getMyJobs() {

        return jobService.getMyJobs();
    }

    // ========================================
    // UPDATE JOB
    // ========================================

    @PutMapping("/{id}")
    public JobResponse updateJob(
            @PathVariable Long id,
            @Valid @RequestBody JobRequest request) {

        return jobService.updateJob(id, request);
    }

    // ========================================
    // DELETE JOB
    // ========================================

    @DeleteMapping("/{id}")
    public String deleteJob(
            @PathVariable Long id) {

        jobService.deleteJob(id);

        return "Job deleted successfully";
    }
}