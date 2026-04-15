package com.eniac.devevolution.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // As portas do seu React
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));

        // Os métodos permitidos (O OPTIONS salva a nossa vida aqui)
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Cabeçalhos que o React envia
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        // Permite o Token JWT
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}