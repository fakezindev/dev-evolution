package com.eniac.devevolution.controllers;

import com.eniac.devevolution.dtos.ProgressoRequestDTO;
import com.eniac.devevolution.dtos.ProgressoResponseDTO;
import com.eniac.devevolution.dtos.RespostaDto;
import com.eniac.devevolution.services.ProgressoService;
import com.eniac.devevolution.entities.Student;
import com.eniac.devevolution.repositories.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/progresso")
public class ProgressoController {

    @Autowired
    private ProgressoService progressoService;

    @Autowired
    private StudentRepository studentRepository;

    // 🎮 ROTA 1: Jogar a Trilha Principal
    @PostMapping("/submeter")
    public ResponseEntity<ProgressoResponseDTO> submeter(@RequestBody ProgressoRequestDTO dto, Authentication authentication) {

        // authentication.getName() pega o username do aluno logado via JWT
        ProgressoResponseDTO response = progressoService.submeterProgresso(
                dto.desafioId(),
                dto.sucesso(),
                authentication.getName()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/resetar")
    public ResponseEntity<String> resetarProgresso(Authentication authentication) {
        progressoService.resetarProgresso(authentication.getName());
        return ResponseEntity.ok("Progresso resetado com sucesso!");
    }

}