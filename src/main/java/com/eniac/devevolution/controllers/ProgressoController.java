package com.eniac.devevolution.controllers;

import com.eniac.devevolution.dtos.ProgressoRequestDTO;
import com.eniac.devevolution.dtos.ProgressoResponseDTO;
import com.eniac.devevolution.services.ProgressoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progresso")
public class ProgressoController {

    @Autowired
    private ProgressoService progressoService;

    // Rota: POST /api/progresso/submeter
    // Requer o Token JWT no cabeçalho (Header -> Authorization: Bearer <token>)
    @PostMapping("/submeter")
    public ResponseEntity<ProgressoResponseDTO> submeterDesafio(
            @RequestBody ProgressoRequestDTO dto,
            Authentication authentication) { // O Spring extrai o usuário do JWT pra você!

        String username = authentication.getName();
        ProgressoResponseDTO response = progressoService.processarSubmissao(username, dto);

        return ResponseEntity.ok(response);
    }
}