package com.eniac.devevolution.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tb_desafios")
@Getter
@Setter
@NoArgsConstructor
public class Desafio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(name = "descricao_markdown", columnDefinition = "TEXT", nullable = false)
    private String descricaoMarkdown;

    @Column(name = "codigo_inicial", columnDefinition = "TEXT")
    private String codigoInicial;

    @Column(name = "codigo_resolucao", columnDefinition = "TEXT")
    private String codigoResolucao;

    @Column(name = "xp_recompensa", nullable = false)
    private Integer xpRecompensa;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "mundo_id", nullable = false)
    private Mundo mundo;

    @Column(name = "topico")
    private String topico;
}
