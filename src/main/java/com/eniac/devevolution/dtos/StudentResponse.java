package com.eniac.devevolution.dtos;

import java.time.LocalDate;

public record StudentResponse(
        Long id,
        String nome,
        String email,
        String curso,
        LocalDate dataNascimento
) {
}
