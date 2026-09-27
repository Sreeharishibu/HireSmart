package com.hiresmart.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class RoleTestController {

    @GetMapping("/candidate/test")
    public String candidateTest() {
        return "Candidate access granted!";
    }

    @GetMapping("/recruiter/test")
    public String recruiterTest() {
        return "Recruiter access granted!";
    }

    @GetMapping("/admin/test")
    public String adminTest() {
        return "Admin access granted!";
    }
}