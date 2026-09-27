package com.hiresmart.repository;

import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hiresmart.entity.Application;

public interface ApplicationRepository
        extends JpaRepository<Application, Long> {

    boolean existsByCandidateIdAndJobId(
            Long candidateId,
            Long jobId);

    List<Application> findByCandidateId(
            Long candidateId);

    List<Application> findByJobRecruiterId(
            Long recruiterId);

    Application findByIdAndJobRecruiterId(
            Long applicationId,
            Long recruiterId);

    @Modifying
    @Query("DELETE FROM Application a WHERE a.job.id = :jobId")
    void deleteByJobId(@Param("jobId") Long jobId);
}