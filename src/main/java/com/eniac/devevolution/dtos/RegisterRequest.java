package com.eniac.devevolution.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record RegisterRequest(
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank @Email String email
){}
