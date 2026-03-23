package com.eniac.devevolution.services;

import com.eniac.devevolution.entities.Trilha;
import com.eniac.devevolution.repositories.TrilhaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TrilhaService {

    @Autowired
    private TrilhaRepository trilhaRepository;

    public List<Trilha> listarTodasAsTrilhas() {
        return trilhaRepository.findAll();
    }

    public Trilha buscarTrilhaPorId(Long id) {
        Optional<Trilha> trilha = trilhaRepository.findById(id);

        // Se não achar a trilha, lança um erro que podemos tratar depois
        return trilha.orElseThrow(() -> new RuntimeException("Trilha não encontrada com o ID: " + id));
    }
}
