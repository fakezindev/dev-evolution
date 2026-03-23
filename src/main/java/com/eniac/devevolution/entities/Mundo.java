package com.eniac.devevolution.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "tb_mundos")
@Getter
@Setter
@NoArgsConstructor
public class Mundo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(nullable = false)
    private Integer ordem;

    @Column(name = "icone_url")
    private String iconeUrl;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "trilha_id", nullable = false)
    private Trilha trilha;

    @OneToMany(mappedBy = "mundo", cascade = CascadeType.ALL)
    private List<Desafio> desafios;
}
