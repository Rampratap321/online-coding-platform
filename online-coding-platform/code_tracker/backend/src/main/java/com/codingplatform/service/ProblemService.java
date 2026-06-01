package com.codingplatform.service;

import com.codingplatform.model.Problem;
import com.codingplatform.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    public Problem getProblemById(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found with id: " + id));
    }

    public Problem createProblem(Problem problem, Long adminId) {
        problem.setCreatedBy(adminId);
        return problemRepository.save(problem);
    }

    public Problem updateProblem(Long id, Problem updatedProblem) {
        Problem problem = getProblemById(id);

        problem.setTitle(updatedProblem.getTitle());
        problem.setDescription(updatedProblem.getDescription());
        problem.setDifficulty(updatedProblem.getDifficulty());
        problem.setTags(updatedProblem.getTags());

        return problemRepository.save(problem);
    }

    public void deleteProblem(Long id) {
        if (!problemRepository.existsById(id)) {
            throw new RuntimeException("Problem not found with id: " + id);
        }
        problemRepository.deleteById(id);
    }
}
