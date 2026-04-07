package com.eniac.devevolution.dtos;

public record RankingDTO(
        Long id,
        String username,
        int xpTotal,
        String fotoPerfil,
        String liga
) {}