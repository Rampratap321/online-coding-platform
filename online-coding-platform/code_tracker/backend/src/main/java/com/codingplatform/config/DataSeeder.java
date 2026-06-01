package com.codingplatform.config;

import com.codingplatform.model.Difficulty;
import com.codingplatform.model.Problem;
import com.codingplatform.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepository;

    @Override
    public void run(String... args) throws Exception {
        if (problemRepository.count() == 0) {
            Problem palindromeProblem = Problem.builder()
                    .title("Valid Palindrome")
                    .description(
                            "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.")
                    .difficulty(Difficulty.EASY)
                    .tags("String, Two Pointers")
                    .build();

            problemRepository.save(palindromeProblem);
            System.out.println("Palindrome problem seeded successfully.");
        } else {
            // Check if Palindrome problem exists
            boolean exists = problemRepository.findAll().stream()
                    .anyMatch(p -> p.getTitle().equals("Valid Palindrome"));
            if (!exists) {
                Problem palindromeProblem = Problem.builder()
                        .title("Valid Palindrome")
                        .description(
                                "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string s, return true if it is a palindrome, or false otherwise.")
                        .difficulty(Difficulty.EASY)
                        .tags("String, Two Pointers")
                        .build();

                problemRepository.save(palindromeProblem);
                System.out.println("Palindrome problem seeded successfully.");
            }
        }
    }
}
