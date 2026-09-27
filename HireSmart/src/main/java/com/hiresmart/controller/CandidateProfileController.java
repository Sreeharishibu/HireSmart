package com.hiresmart.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hiresmart.entity.CandidateProfile;
import com.hiresmart.service.CandidateProfileService;

@RestController
@RequestMapping("/api/candidate/profile")
public class CandidateProfileController {

    private final CandidateProfileService profileService;

    public CandidateProfileController(
            CandidateProfileService profileService) {

        this.profileService = profileService;
    }

    // ========================================
    // GET PROFILE
    // ========================================

    @GetMapping
    public ResponseEntity<CandidateProfile> getProfile() {

        return ResponseEntity.ok(
                profileService.getProfile());
    }

    // ========================================
    // SAVE / UPDATE PROFILE
    // ========================================

    @PutMapping
    public ResponseEntity<CandidateProfile> saveProfile(
            @RequestBody CandidateProfile request) {

        return ResponseEntity.ok(
                profileService.saveProfile(request));
    }
}