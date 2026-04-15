package com.eniac.devevolution.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "tb_trilhas")
@Getter
@Setter
@NoArgsConstructor
public class Trilha {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "icone_url")
    private String iconeUrl;

    @OneToMany(mappedBy = "trilha", cascade = CascadeType.ALL)
    private List<Mundo> mundos;
}
