package com.eniac.devevolution.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // As portas do React (Vite e Create React App)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000"
        ));

        // Os verbos que o front-end pode usar
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Os cabeçalhos permitidos (Vital para o Token JWT passar)
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        // Permite o envio de credenciais/cookies
        configuration.setAllowCredentials(true);

        // Aplica essa regra de CORS para absolutamente todas as rotas da sua API (/**)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}