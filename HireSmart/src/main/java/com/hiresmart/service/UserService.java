package com.hiresmart.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hiresmart.dto.LoginRequest;
import com.hiresmart.dto.LoginResponse;
import com.hiresmart.entity.User;
import com.hiresmart.exception.EmailAlreadyExistsException;
import com.hiresmart.repository.UserRepository;
import com.hiresmart.security.JwtService;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User saveUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {

            throw new EmailAlreadyExistsException(
                    "Email already registered");
        }

        String encodedPassword =
                passwordEncoder.encode(user.getPassword());

        user.setPassword(encodedPassword);

        return userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {

        String email = request.getEmail().trim();

        System.out.println(
                "LOGIN EMAIL RECEIVED: [" + email + "]");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found for email: " + email));

        System.out.println(
                "USER FOUND: " +
                user.getEmail() +
                " | ROLE: " +
                user.getRole());

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid password");
        }

        String token =
                jwtService.generateToken(user);

        LoginResponse response =
                new LoginResponse();

        response.setToken(token);
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());

        return response;
    }
}