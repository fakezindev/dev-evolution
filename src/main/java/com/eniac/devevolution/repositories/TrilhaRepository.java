package com.eniac.devevolution.repositories;

import com.eniac.devevolution.entities.Trilha;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrilhaRepository extends JpaRepository<Trilha,Long> {
}
