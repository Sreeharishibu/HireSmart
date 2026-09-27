package com.hiresmart.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            CustomUserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // Check whether Authorization header exists
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        // Remove "Bearer " from the token
        String token = authHeader.substring(7);

        // Validate JWT
        if (jwtService.isTokenValid(token)) {

            System.out.println("JWT IS VALID");

            // Get email from JWT
            String email = jwtService.extractEmail(token);

            // Find user from database
            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(email);

            System.out.println("Logged in user: " + email);
            System.out.println(
                    "User roles: " + userDetails.getAuthorities());

            // Create authenticated user
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());

            // Store authentication in SecurityContext
            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

        } else {

            System.out.println("JWT IS INVALID");
        }

        // Continue request
        filterChain.doFilter(request, response);
    }
}