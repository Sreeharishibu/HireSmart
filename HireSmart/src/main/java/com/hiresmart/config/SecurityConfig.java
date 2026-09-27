package com.hiresmart.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.hiresmart.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http.csrf(csrf -> csrf.disable());

        http.cors(cors ->
                cors.configurationSource(corsConfigurationSource()));

        http.sessionManagement(session ->
                session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS));

        http.authorizeHttpRequests(auth ->
        auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

            .requestMatchers(
                    "/api/auth/register",
                    "/api/auth/login",
                    "/api/ai/test",
                    "/error"
            ).permitAll()

            .requestMatchers("/api/ai/improve/**")
            .hasRole("CANDIDATE")

            .requestMatchers("/api/candidate/**")
            .hasRole("CANDIDATE")

            .requestMatchers("/api/jobs/**")
            .hasRole("CANDIDATE")

            .requestMatchers("/api/recruiter/**")
            .hasRole("RECRUITER")

            .requestMatchers("/api/admin/**")
            .hasRole("ADMIN")

            .anyRequest().authenticated()
);
        http.addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:3000", "http://localhost:5173"));

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                ));

        configuration.setAllowedHeaders(
                List.of("*"));

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration);

        return source;
    }
}