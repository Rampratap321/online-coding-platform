package com.codingplatform.service;

import com.codingplatform.model.Discussion;
import com.codingplatform.model.Problem;
import com.codingplatform.model.User;
import com.codingplatform.repository.DiscussionRepository;
import com.codingplatform.repository.ProblemRepository;
import com.codingplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DiscussionService {

    private final DiscussionRepository discussionRepository;
    private final ProblemRepository problemRepository;
    private final UserRepository userRepository;

    public Discussion addComment(Long problemId, Long userId, String comment) {
        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Discussion discussion = Discussion.builder()
                .problem(problem)
                .user(user)
                .comment(comment)
                .build();

        return discussionRepository.save(discussion);
    }

    public List<Discussion> getCommentsForProblem(Long problemId) {
        return discussionRepository.findByProblemIdOrderByCreatedAtDesc(problemId);
    }
}
