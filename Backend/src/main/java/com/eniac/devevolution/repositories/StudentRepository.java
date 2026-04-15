package com.eniac.devevolution.repositories;

import com.eniac.devevolution.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUsername(String username);
    boolean existsByEmail(String email);
    List<Student> findAllByOrderByXpTotalDesc();
}
