package com.eniac.devevolution.repositories;

import com.eniac.devevolution.entities.Desafio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DesafioRepository extends JpaRepository<Desafio,Long> {
    // Traz todos os desafios (Hello World, Mover Caixa, etc) de um mundo
    List<Desafio> findByMundoId(Long mundoId);
}
