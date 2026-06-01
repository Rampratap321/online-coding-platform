package com.codingplatform.service;

import com.codingplatform.model.Problem;
import com.codingplatform.model.Submission;
import com.codingplatform.model.SubmissionStatus;
import com.codingplatform.model.User;
import com.codingplatform.repository.ProblemRepository;
import com.codingplatform.repository.SubmissionRepository;
import com.codingplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;
    private final LeaderboardService leaderboardService;

    @Transactional
    public Submission submitCode(Long userId, Long problemId, String code, String language) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        // Mock evaluation logic
        Random random = new Random();
        boolean isAccepted = random.nextInt(100) > 30; // 70% chance of success for mock

        SubmissionStatus status = isAccepted ? SubmissionStatus.ACCEPTED : SubmissionStatus.WRONG_ANSWER;
        Float runtime = isAccepted ? 20.5f + random.nextFloat() * 50f : 0f;
        Float memory = isAccepted ? 40.2f + random.nextFloat() * 10f : 0f;

        Submission submission = Submission.builder()
                .user(user)
                .problem(problem)
                .code(code)
                .language(language)
                .status(status)
                .runtime(runtime)
                .memory(memory)
                .build();

        Submission savedSubmission = submissionRepository.save(submission);

        if (status == SubmissionStatus.ACCEPTED) {
            // Check if this problem was already solved by this user
            List<Submission> userSubmissions = submissionRepository.findByUserIdOrderBySubmittedAtDesc(userId);
            boolean alreadySolved = userSubmissions.stream()
                    .anyMatch(s -> s.getProblem().getId().equals(problemId)
                            && s.getStatus() == SubmissionStatus.ACCEPTED
                            && !s.getId().equals(savedSubmission.getId()));

            if (!alreadySolved) {
                int score = calculateScore(problem.getDifficulty().name());
                leaderboardService.updateUserScore(user, score);
            }
        }

        return savedSubmission;
    }

    private int calculateScore(String difficulty) {
        return switch (difficulty) {
            case "EASY" -> 10;
            case "MEDIUM" -> 30;
            case "HARD" -> 70;
            default -> 0;
        };
    }

    public List<Submission> getUserSubmissions(Long userId) {
        return submissionRepository.findByUserIdOrderBySubmittedAtDesc(userId);
    }

    public List<Submission> getProblemSubmissions(Long problemId) {
        return submissionRepository.findByProblemIdOrderBySubmittedAtDesc(problemId);
    }
}
