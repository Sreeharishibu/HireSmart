package com.hiresmart.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hiresmart.dto.ATSAnalysisResponse;
import com.hiresmart.entity.Job;
import com.hiresmart.repository.JobRepository;
import com.hiresmart.service.ATSService;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final JobRepository jobRepository;
    private final ATSService atsService;

    public AIController(
            JobRepository jobRepository,
            ATSService atsService) {

        this.jobRepository = jobRepository;
        this.atsService = atsService;
    }


    // ========================================
    // GENERAL AI IMPROVEMENT
    // ========================================

    @PostMapping("/improve")
    public Map<String, Object> improveResume(
            @RequestBody Map<String, Object> request) {

        String resumeText =
                (String) request.getOrDefault(
                        "resumeText",
                        "");

        String jobDescription =
                (String) request.getOrDefault(
                        "jobDescription",
                        "");

        List<String> suggestions =
                new ArrayList<>();

        suggestions.add(
                "Add keywords from the job description to your resume."
        );

        suggestions.add(
                "Highlight projects relevant to the required skills."
        );

        suggestions.add(
                "Add measurable results to your project descriptions."
        );

        suggestions.add(
                "Mention your experience with the technologies required by the job."
        );

        return Map.of(
                "summary",
                "Your resume has been analyzed against the selected job.",

                "suggestions",
                suggestions,

                "resumeLength",
                resumeText.length(),

                "jobDescriptionLength",
                jobDescription.length()
        );
    }


    // ========================================
    // JOB-SPECIFIC AI IMPROVEMENT
    // ========================================

    @PostMapping("/improve/{jobId}")
    public Map<String, Object> improveForJob(
            @PathVariable Long jobId) {


        // ----------------------------------------
        // FIND JOB
        // ----------------------------------------

        Job job =
                jobRepository.findById(jobId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job not found with ID: "
                                                + jobId
                                )
                        );


        // ----------------------------------------
        // GET EXISTING ATS RESULT
        // ----------------------------------------

        ATSAnalysisResponse atsResult =
                atsService.getATSResult(jobId);


        String missingSkills =
                atsResult.getMissingSkills();

        String matchedSkills =
                atsResult.getMatchedSkills();


        double score =
                atsResult.getMatchScore();


        List<String> suggestions =
                new ArrayList<>();


        // ----------------------------------------
        // SCORE-BASED SUGGESTION
        // ----------------------------------------

        if (score < 50) {

            suggestions.add(
                    "Your current ATS match is below 50%. "
                    + "Focus on adding the most relevant skills "
                    + "from the job description."
            );

        } else if (score < 80) {

            suggestions.add(
                    "Your ATS match is moderate. "
                    + "Strengthen the missing skills and "
                    + "show them through projects or experience."
            );

        } else {

            suggestions.add(
                    "Your ATS match is strong. "
                    + "Focus on improving achievements, "
                    + "clarity and measurable results."
            );

        }


        // ----------------------------------------
        // MISSING SKILLS
        // ----------------------------------------

        if (missingSkills != null
                && !missingSkills.isBlank()) {

            suggestions.add(
                    "Missing skills detected: "
                            + missingSkills
                            + ". Add these skills only if "
                            + "you genuinely have experience with them."
            );

        } else {

            suggestions.add(
                    "No required skills are currently missing "
                            + "from your resume."
            );

        }


        // ----------------------------------------
        // MATCHED SKILLS
        // ----------------------------------------

        if (matchedSkills != null
                && !matchedSkills.isBlank()) {

            suggestions.add(
                    "Keep these matched skills clearly visible "
                            + "in your resume: "
                            + matchedSkills
            );

        }


        // ----------------------------------------
        // PROJECT SUGGESTION
        // ----------------------------------------

        suggestions.add(
                "Highlight projects that demonstrate the "
                        + "technical skills required for this job."
        );


        // ----------------------------------------
        // ACHIEVEMENT SUGGESTION
        // ----------------------------------------

        suggestions.add(
                "Add measurable achievements such as "
                        + "performance improvements, users served, "
                        + "or project results."
        );


        // ----------------------------------------
        // ATS FORMATTING
        // ----------------------------------------

        suggestions.add(
                "Keep technical skills clearly visible and "
                        + "use standard section names such as "
                        + "Skills, Experience and Projects."
        );


        // ----------------------------------------
        // RETURN RESPONSE
        // ----------------------------------------

        return Map.of(

                "jobId",
                jobId,

                "jobTitle",
                job.getTitle(),

                "company",
                job.getCompany(),

                "matchScore",
                score,

                "matchedSkills",
                matchedSkills == null
                        ? ""
                        : matchedSkills,

                "missingSkills",
                missingSkills == null
                        ? ""
                        : missingSkills,

                "summary",
                atsResult.getSummary(),

                "suggestions",
                suggestions
        );
    }
}