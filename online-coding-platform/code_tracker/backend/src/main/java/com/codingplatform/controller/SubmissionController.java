package com.codingplatform.controller;

import com.codingplatform.model.Submission;
import com.codingplatform.security.UserDetailsImpl;
import com.codingplatform.service.SubmissionService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping("/submit")
    public ResponseEntity<Submission> submitCode(@RequestBody SubmissionRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        Submission submission = submissionService.submitCode(
                userDetails.getId(),
                request.getProblemId(),
                request.getCode(),
                request.getLanguage());
        return ResponseEntity.ok(submission);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Submission>> getUserSubmissions(@PathVariable Long userId) {
        return ResponseEntity.ok(submissionService.getUserSubmissions(userId));
    }

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<List<Submission>> getProblemSubmissions(@PathVariable Long problemId) {
        return ResponseEntity.ok(submissionService.getProblemSubmissions(problemId));
    }

    @Data
    public static class SubmissionRequest {
        private Long problemId;
        private String code;
        private String language;
    }
}
