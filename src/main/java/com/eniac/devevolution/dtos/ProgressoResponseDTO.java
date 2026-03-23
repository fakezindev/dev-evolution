package com.eniac.devevolution.dtos;

public record ProgressoResponseDTO(
        String mensagem,
        int xpTotal,
        int vidasAtuais,
        boolean concluido
) {}