package com.hiresmart.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hiresmart.entity.Job;

public interface JobRepository extends JpaRepository<Job, Long> {

    List<Job> findByRecruiterId(Long recruiterId);

}