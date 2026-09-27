package com.hiresmart.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hiresmart.entity.ATSResult;

public interface ATSResultRepository extends JpaRepository<ATSResult, Long> {

    Optional<ATSResult> findByResumeIdAndJobId(Long resumeId, Long jobId);

}