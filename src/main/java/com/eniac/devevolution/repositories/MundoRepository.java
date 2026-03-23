package com.eniac.devevolution.repositories;

import com.eniac.devevolution.entities.Mundo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MundoRepository extends JpaRepository<Mundo,Long> {
    // Metodo mágico do Spring: Busca todos os mundos de uma trilha específica e já ordena!
    List<Mundo> findByTrilhaIdOrderByOrdemAsc(Long trilhaId);
}
