package com.eniac.devevolution.controllers;

import com.eniac.devevolution.dtos.ProgressoRequestDTO;
import com.eniac.devevolution.dtos.ProgressoResponseDTO;
import com.eniac.devevolution.dtos.RespostaDto;
import com.eniac.devevolution.entities.Student;
import com.eniac.devevolution.entities.User;
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

    // 🎮 ROTA 1: Jogar a Trilha Principal (Lição 1, 2, etc)
    @PostMapping("/submeter")
    public ResponseEntity<String> submeterDesafio(@RequestBody RespostaDto resposta, Authentication authentication) {

        // Pega o usuário logado através do Token JWT
        // (Ajuste o cast para a classe exata que o seu JwtAuthenticationFilter coloca no contexto)
        User usuarioLogado = (User) authentication.getPrincipal();
        Long studentId = usuarioLogado.getId();

        // Passa a bola para o Service fazer a mágica (dar XP ou tirar vida)
        // Note o uso de resposta.desafioId() e resposta.sucesso() por causa do Record!
        progressoService.processarSubmissaoPrincipal(studentId, resposta.desafioId(), resposta.sucesso());;

        return ResponseEntity.ok("Progresso registrado com sucesso!");
    }

    // 💖 ROTA 2: Recuperar Vidas (Aulinha de Reforço)
    @PostMapping("/recuperar-vida")
    public ResponseEntity<String> recuperarVida(@RequestBody RespostaDto resposta, Authentication authentication) {

        User usuarioLogado = (User) authentication.getPrincipal();
        Long studentId = usuarioLogado.getId();

        // Passa a bola para o Service devolver o coração do aluno
        progressoService.processarSubmissaoRecuperacao(studentId, resposta.sucesso());

        return ResponseEntity.ok("Tentativa de recuperação processada!");
    }

}