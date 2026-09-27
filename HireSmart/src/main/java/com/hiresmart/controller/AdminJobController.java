package com.hiresmart.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hiresmart.entity.Job;
import com.hiresmart.repository.ApplicationRepository;
import com.hiresmart.repository.JobRepository;

@RestController
@RequestMapping("/api/admin/jobs")
public class AdminJobController {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;

    public AdminJobController(
            JobRepository jobRepository,
            ApplicationRepository applicationRepository) {

        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(
            @PathVariable Long id) {

        if (!jobRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        applicationRepository.deleteByJobId(id);

        jobRepository.deleteById(id);

        return ResponseEntity.ok(
                "Job and related applications deleted successfully");
    }
}