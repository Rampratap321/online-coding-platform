package com.codingplatform.service;

import com.codingplatform.model.Leaderboard;
import com.codingplatform.model.User;
import com.codingplatform.repository.LeaderboardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final LeaderboardRepository leaderboardRepository;

    public List<Leaderboard> getTopUsers() {
        return leaderboardRepository.findAllByOrderByScoreDesc();
    }

    public Leaderboard getUserLeaderboardEntry(Long userId) {
        return leaderboardRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Leaderboard entry not found for user: " + userId));
    }

    @Transactional
    public void updateUserScore(User user, int scoreToAdd) {
        Leaderboard leaderboard = leaderboardRepository.findByUserId(user.getId())
                .orElseGet(() -> Leaderboard.builder()
                        .user(user)
                        .problemsSolved(0)
                        .score(0)
                        .rankPosition(0)
                        .build());

        leaderboard.setProblemsSolved(leaderboard.getProblemsSolved() + 1);
        leaderboard.setScore(leaderboard.getScore() + scoreToAdd);
        leaderboard.setLastUpdated(LocalDateTime.now());

        leaderboardRepository.save(leaderboard);
        updateRanks(); // Recalculate ranks (simplified approach)
    }

    private void updateRanks() {
        List<Leaderboard> allEntries = leaderboardRepository.findAllByOrderByScoreDesc();
        int rank = 1;
        for (Leaderboard entry : allEntries) {
            entry.setRankPosition(rank++);
            leaderboardRepository.save(entry);
        }
    }
}
