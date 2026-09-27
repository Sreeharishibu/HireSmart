package com.hiresmart.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import com.hiresmart.dto.ApplicationStatusRequest;
import com.hiresmart.dto.ApplicantResponse;
import com.hiresmart.dto.ApplicationResponse;
import com.hiresmart.service.ApplicationService;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // CANDIDATE - APPLY FOR JOB
    @PostMapping("/candidate/applications/{jobId}")
    public ApplicationResponse applyForJob(@PathVariable Long jobId) {
        return applicationService.applyForJob(jobId);
    }

    // CANDIDATE - GET MY APPLICATIONS
    @GetMapping("/candidate/applications")
    public List<ApplicationResponse> getMyApplications() {
        return applicationService.getMyApplications();
    }

    // RECRUITER - GET APPLICANTS
    @GetMapping("/recruiter/applicants")
    public List<ApplicantResponse> getRecruiterApplicants() {
        return applicationService.getRecruiterApplicants();
    }

    // RECRUITER - UPDATE APPLICATION STATUS
    @PutMapping("/recruiter/applications/{applicationId}/status")
    public ApplicationResponse updateApplicationStatus(
            @PathVariable Long applicationId,
            @Valid @RequestBody ApplicationStatusRequest request) {

        return applicationService.updateApplicationStatus(
                applicationId,
                request.getStatus());
    }
}