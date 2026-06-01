package com.codingplatform.service;

import com.codingplatform.dto.JwtResponse;
import com.codingplatform.dto.LoginRequest;
import com.codingplatform.dto.RegisterRequest;
import com.codingplatform.model.Leaderboard;
import com.codingplatform.model.Role;
import com.codingplatform.model.User;
import com.codingplatform.repository.LeaderboardRepository;
import com.codingplatform.repository.UserRepository;
import com.codingplatform.security.JwtUtil;
import com.codingplatform.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final LeaderboardRepository leaderboardRepository;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles);
    }

    @Transactional
    public User registerUser(RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .role(Role.USER) // Default role
                .build();

        User savedUser = userRepository.save(user);

        // Initialize Leaderboard for user
        Leaderboard leaderboardEntry = Leaderboard.builder()
                .user(savedUser)
                .problemsSolved(0)
                .score(0)
                .rankPosition(0) // 0 implies unranked initially
                .lastUpdated(LocalDateTime.now())
                .build();
        leaderboardRepository.save(leaderboardEntry);

        return savedUser;
    }
}
