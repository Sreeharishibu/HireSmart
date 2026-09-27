package com.hiresmart.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hiresmart.dto.ResumeResponse;
import com.hiresmart.entity.Resume;
import com.hiresmart.entity.User;
import com.hiresmart.repository.ResumeRepository;
import com.hiresmart.repository.UserRepository;

@Service
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;

    private final String uploadDirectory = "uploads/resumes";

    public ResumeService(
            ResumeRepository resumeRepository,
            UserRepository userRepository) {

        this.resumeRepository = resumeRepository;
        this.userRepository = userRepository;
    }

    public ResumeResponse uploadResume(MultipartFile file) {

        if (file.isEmpty()) {
            throw new RuntimeException("Please select a file");
        }

        String contentType = file.getContentType();

        if (contentType == null ||
                !contentType.equals("application/pdf")) {

            throw new RuntimeException(
                    "Only PDF resumes are allowed");
        }

        Authentication authentication =
                SecurityContextHolder.getContext()
                        .getAuthentication();

        String email = authentication.getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Candidate not found"));

        try {

            Path uploadPath =
                    Paths.get(uploadDirectory);

            Files.createDirectories(uploadPath);

            String fileName =
                    UUID.randomUUID()
                    + "_"
                    + file.getOriginalFilename();

            Path filePath =
                    uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(), filePath);

            // Extract text from PDF
            String resumeText;

            try (PDDocument document =
                    Loader.loadPDF(filePath.toFile())) {

                PDFTextStripper stripper =
                        new PDFTextStripper();

                resumeText = stripper.getText(document);
            }

            // Save resume information
            Resume resume = new Resume();

            resume.setFileName(file.getOriginalFilename());
            resume.setFilePath(filePath.toString());
            resume.setFileType(contentType);
            resume.setCandidateId(candidate.getId());
            resume.setResumeText(resumeText);

            Resume savedResume =
                    resumeRepository.save(resume);

            ResumeResponse response =
                    new ResumeResponse();

            response.setId(savedResume.getId());
            response.setFileName(savedResume.getFileName());
            response.setFileType(savedResume.getFileType());
            response.setMessage(
                    "Resume uploaded and text extracted successfully");

            return response;

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to upload or read resume");
        }
    }
}