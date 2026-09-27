package com.hiresmart.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.hiresmart.dto.ResumeResponse;
import com.hiresmart.service.ResumeService;

@RestController
@RequestMapping("/api/candidate/resume")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ResumeResponse> uploadResume(
            @RequestParam("file") MultipartFile file) {

        return ResponseEntity.ok(
                resumeService.uploadResume(file));
    }
}