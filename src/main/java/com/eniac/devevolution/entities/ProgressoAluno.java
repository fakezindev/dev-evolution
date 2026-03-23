package com.eniac.devevolution.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "tb_progresso_aluno")
@Getter
@Setter
@NoArgsConstructor
public class ProgressoAluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mudamos de PerfilAluno para Student
    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "desafio_id", nullable = false)
    private Desafio desafio;

    @Column(nullable = false)
    private Boolean concluido = false;

    @Column(name = "codigo_submetido", columnDefinition = "TEXT")
    private String codigoSubmetido;

    @Column(name = "data_conclusao")
    private LocalDateTime dataConclusao;
}