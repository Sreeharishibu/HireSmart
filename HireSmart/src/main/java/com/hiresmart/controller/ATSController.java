package com.hiresmart.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hiresmart.dto.ATSAnalysisResponse;
import com.hiresmart.service.ATSService;

@RestController
@RequestMapping("/api/candidate/ats")
public class ATSController {

    private final ATSService atsService;

    public ATSController(ATSService atsService) {
        this.atsService = atsService;
    }

    @PostMapping("/analyze/{jobId}")
    public ResponseEntity<ATSAnalysisResponse> analyzeResume(
            @PathVariable Long jobId) {

        return ResponseEntity.ok(
                atsService.analyzeResume(jobId)
        );
    }
}