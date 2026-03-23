package com.eniac.devevolution.dtos;

import java.time.LocalDate;

public record StudentResponse(
        Long id,
        String username,
        String email,
        String curso,
        LocalDate dataNascimento,
        Integer xpTotal,
        Integer vidasAtuais
) {
}
