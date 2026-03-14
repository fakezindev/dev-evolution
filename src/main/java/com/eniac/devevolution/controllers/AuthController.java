package com.eniac.devevolution.controllers;

import com.eniac.devevolution.dtos.AuthRequest;
import com.eniac.devevolution.dtos.AuthResponse;
import com.eniac.devevolution.dtos.RegisterRequest;
import com.eniac.devevolution.entities.User;
import com.eniac.devevolution.services.JwtService;
import com.eniac.devevolution.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest request) {
        User user = userService.register(request);
        String token = jwtService.generateToken(user.getUsername(), user.getPerfil());
        return ResponseEntity.status(HttpStatus.CREATED).body(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        User user = userService.findByUsername(request.username());
        String token = jwtService.generateToken(user.getUsername(), user.getPerfil());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
