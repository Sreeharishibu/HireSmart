package com.hiresmart.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.hiresmart.entity.CandidateProfile;
import com.hiresmart.entity.User;
import com.hiresmart.repository.CandidateProfileRepository;
import com.hiresmart.repository.UserRepository;

@Service
public class CandidateProfileService {

    private final CandidateProfileRepository profileRepository;
    private final UserRepository userRepository;

    public CandidateProfileService(
            CandidateProfileRepository profileRepository,
            UserRepository userRepository) {

        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    // ========================================
    // GET LOGGED-IN CANDIDATE
    // ========================================

    private User getLoggedInCandidate() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Candidate not found"));
    }

    // ========================================
    // GET PROFILE
    // ========================================

    public CandidateProfile getProfile() {

        User candidate = getLoggedInCandidate();

        return profileRepository
                .findByCandidateId(candidate.getId())
                .orElseGet(() -> {

                    CandidateProfile profile =
                            new CandidateProfile();

                    profile.setCandidateId(
                            candidate.getId());

                    return profileRepository.save(profile);
                });
    }

    // ========================================
    // SAVE / UPDATE PROFILE
    // ========================================

    public CandidateProfile saveProfile(
            CandidateProfile request) {

        User candidate = getLoggedInCandidate();

        CandidateProfile profile =
                profileRepository
                        .findByCandidateId(candidate.getId())
                        .orElse(new CandidateProfile());

        profile.setCandidateId(
                candidate.getId());

        profile.setPhone(
                request.getPhone());

        profile.setLocation(
                request.getLocation());

        profile.setSkills(
                request.getSkills());

        profile.setEducation(
                request.getEducation());

        profile.setExperience(
                request.getExperience());

        profile.setLinkedin(
                request.getLinkedin());

        profile.setGithub(
                request.getGithub());

        return profileRepository.save(profile);
    }
}