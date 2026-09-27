package com.hiresmart.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hiresmart.entity.CandidateProfile;

public interface CandidateProfileRepository
        extends JpaRepository<CandidateProfile, Long> {

    Optional<CandidateProfile> findByCandidateId(Long candidateId);
}