package com.eniac.devevolution.controllers;

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
    public ResponseEntity<Map<String, Boolean>> submeterDesafio(@RequestBody RespostaDto resposta, Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String usernameLogado = userDetails.getUsername();

        Student student = studentRepository.findByUsername(usernameLogado)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        // Guarda o resultado que veio do Service
        boolean xpGanho = progressoService.processarSubmissaoPrincipal(student.getId(), resposta.desafioId(), resposta.sucesso());

        // Manda um JSON bonitinho: { "xpGanho": true } ou { "xpGanho": false }
        return ResponseEntity.ok(Map.of("xpGanho", xpGanho));
    }

    // 💖 ROTA 2: Recuperar Vidas
    @PostMapping("/recuperar-vida")
    public ResponseEntity<String> recuperarVida(@RequestBody RespostaDto resposta, Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String usernameLogado = userDetails.getUsername();

        // Trocamos o findByEmail pelo findByUsername aqui também!
        Student student = studentRepository.findByUsername(usernameLogado)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado com o username: " + usernameLogado));

        progressoService.processarSubmissaoRecuperacao(student.getId(), resposta.sucesso());

        return ResponseEntity.ok("Tentativa de recuperação processada!");
    }
}