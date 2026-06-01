package com.codingplatform.controller;

import com.codingplatform.model.Leaderboard;
import com.codingplatform.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<List<Leaderboard>> getLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getTopUsers());
    }
}
