package com.eniac.devevolution.controllers;

import com.eniac.devevolution.entities.Trilha;
import com.eniac.devevolution.repositories.TrilhaRepository;
import com.eniac.devevolution.services.TrilhaService;
import jakarta.persistence.Access;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/trilhas")
public class TrilhaController {

    @Autowired
    private TrilhaService trilhaService;

    // Rota: GET /api/trilhas
    // Retorna a lista de todas as trilhas disponíveis no DevEvolution
    @GetMapping
    public ResponseEntity<List<Trilha>> listarTrilhas() {
        List<Trilha> trilhas = trilhaService.listarTodasAsTrilhas();
        return ResponseEntity.ok(trilhas);
    }

    // Rota: GET /api/trilhas/{id}
    // Retorna os detalhes de uma trilha específica (com todos os mundos e missões dentro)
    @GetMapping("/{id}")
    public ResponseEntity<Trilha> buscarTrilha(@PathVariable Long id) {
        Trilha trilha = trilhaService.buscarTrilhaPorId(id);
        return ResponseEntity.ok(trilha);
    }
}
