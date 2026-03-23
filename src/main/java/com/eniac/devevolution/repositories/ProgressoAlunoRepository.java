package com.eniac.devevolution.repositories;

import com.eniac.devevolution.entities.ProgressoAluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressoAlunoRepository extends JpaRepository<ProgressoAluno,Long> {

    // Busca t0do o histórico de um aluno (para montar o painel de conquistas dele)
    List<ProgressoAluno> findByStudentId(Long studentId);

    // Busca se o aluno JÁ FEZ um desafio específico (evita que ele ganhe XP duplicado!)
    Optional<ProgressoAluno> findByStudentIdAndDesafioId(Long studentId, Long desafioId);
}
