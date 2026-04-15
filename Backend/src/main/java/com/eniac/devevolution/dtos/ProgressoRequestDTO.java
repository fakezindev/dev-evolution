package com.eniac.devevolution.dtos;

public record ProgressoRequestDTO(
        Long desafioId,
        String codigoSubmetido,
        boolean sucesso // O React avisa se a validação do JS passou ou falhou
) {}