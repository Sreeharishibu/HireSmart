package com.hiresmart.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hiresmart.entity.Resume;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    Optional<Resume> findFirstByCandidateIdOrderByIdDesc(Long candidateId);

}