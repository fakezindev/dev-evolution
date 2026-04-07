package com.eniac.devevolution.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "tb_students")
@NoArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String curso;

    @Column(columnDefinition = "TEXT")
    private String fotoPerfil;

    @Column
    private LocalDate dataNascimento;

    @Column(name = "xp_total", nullable = false, columnDefinition = "integer default 0")
    private Integer xpTotal = 0;

    @Column(name = "vidas_atuais", nullable = false, columnDefinition = "integer default 3")
    private Integer vidasAtuais = 3;

    // Relação 1:N - Um aluno tem vários progressos (um para cada desafio)
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<ProgressoAluno> progressos = new ArrayList<>();

}
