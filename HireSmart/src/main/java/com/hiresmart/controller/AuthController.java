package com.hiresmart.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.hiresmart.dto.RegisterRequest;
import com.hiresmart.dto.UserResponse;
import com.hiresmart.entity.User;
import com.hiresmart.service.UserService;
import com.hiresmart.dto.LoginRequest;
import com.hiresmart.dto.LoginResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {

        this.userService = userService;
    }

    // REGISTER
    @PostMapping("/register")
    public UserResponse register(@RequestBody RegisterRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

     // Create candidate account
        user.setRole("CANDIDATE");

        User savedUser = userService.saveUser(user);

        UserResponse response = new UserResponse();

        response.setId(savedUser.getId());
        response.setName(savedUser.getName());
        response.setEmail(savedUser.getEmail());
        response.setRole(savedUser.getRole());

        return response;
    }

    // LOGIN
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        return userService.login(request);
    }
}