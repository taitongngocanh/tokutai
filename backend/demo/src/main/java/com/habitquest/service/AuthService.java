package com.habitquest.service;

import com.habitquest.dto.AuthResponse;
import com.habitquest.dto.LoginRequest;
import com.habitquest.dto.RegisterRequest;
import com.habitquest.entity.User;
import com.habitquest.repository.UserRepository;
import com.habitquest.security.JwtUtil;
import com.habitquest.util.RankUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .xp(0)
                .rank("Bronze")
                .build();
        user = userRepository.save(user);
        String token = jwtUtil.generateToken(user.getUsername());
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .xp(user.getXp())
                .rank(user.getRank())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String token = jwtUtil.generateToken(user.getUsername());
        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .xp(user.getXp())
                .rank(user.getRank())
                .build();
    }
}
