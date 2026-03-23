package com.eniac.devevolution.config;

import com.eniac.devevolution.entities.Desafio;
import com.eniac.devevolution.entities.Mundo;
import com.eniac.devevolution.entities.Trilha;
import com.eniac.devevolution.repositories.DesafioRepository;
import com.eniac.devevolution.repositories.MundoRepository;
import com.eniac.devevolution.repositories.TrilhaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.Arrays;

@Configuration
public class TestConfig implements CommandLineRunner {

    @Autowired
    private TrilhaRepository trilhaRepository;

    @Autowired
    private MundoRepository mundoRepository;

    @Autowired
    private DesafioRepository desafioRepository;

    @Override
    public void run(String... args) throws Exception {

        // Só vai inserir se o banco estiver vazio (evita duplicar dados toda vez que salvar o código)
        if (trilhaRepository.count() == 0) {

            System.out.println("Populando o banco de dados do DevEvolution com a Trilha inicial...");

            // 1. Criando a Trilha Principal
            Trilha trilhaJs = new Trilha();
            trilhaJs.setNome("JavaScript Evolution");
            trilhaJs.setDescricao("Aprenda a programar do zero com o robô DevHero e domine a web.");
            trilhaJs.setIconeUrl("https://dev-evolution.com/icons/js-icon.png"); // Exemplo
            trilhaRepository.save(trilhaJs);

            // 2. Criando o Mundo 1 e Mundo 2
            Mundo mundo1 = new Mundo();
            mundo1.setTitulo("Mundo 1: O Início da Jornada");
            mundo1.setOrdem(1);
            mundo1.setTrilha(trilhaJs);

            Mundo mundo2 = new Mundo();
            mundo2.setTitulo("Mundo 2: Caminhos Alternativos (If/Else)");
            mundo2.setOrdem(2);
            mundo2.setTrilha(trilhaJs);

            mundoRepository.saveAll(Arrays.asList(mundo1, mundo2));

            // 3. Criando os Desafios (Baseados no seu Figma!)
            Desafio desafio1 = new Desafio();
            desafio1.setTitulo("Hello World");
            desafio1.setDescricaoMarkdown("Use a função `console.log(\"Olá, Mundo!\")` para imprimir uma mensagem na tela.");
            desafio1.setCodigoInicial("// Digite seu código abaixo:\n\n");
            desafio1.setCodigoResolucao("console.log(\"Olá, Mundo!\");");
            desafio1.setXpRecompensa(50);
            desafio1.setMundo(mundo1);

            Desafio desafio2 = new Desafio();
            desafio2.setTitulo("Missão do Robô");
            desafio2.setDescricaoMarkdown("O teu objetivo é mover o robô até ao objetivo! Escreve o comando `moverDireita()` 4 vezes.");
            desafio2.setCodigoInicial("// Escreve o comando moverDireita() 4 vezes\n\n");
            desafio2.setCodigoResolucao("moverDireita();\nmoverDireita();\nmoverDireita();\nmoverDireita();");
            desafio2.setXpRecompensa(100);
            desafio2.setMundo(mundo1);

            Desafio desafio3 = new Desafio();
            desafio3.setTitulo("Pedra no Caminho");
            desafio3.setDescricaoMarkdown("O robô está a andar, mas no meio do caminho existe uma PEDRA! Se houver pedra (`temPedra`), use a função `pular()`. Senão, use `moverDireita()`.");
            desafio3.setCodigoInicial("if (temPedra) {\n  // escreva aqui o que fazer\n} else {\n  // e se não tiver pedra?\n}");
            desafio3.setCodigoResolucao("if (temPedra) {\n  pular();\n} else {\n  moverDireita();\n}");
            desafio3.setXpRecompensa(150);
            desafio3.setMundo(mundo2);

            desafioRepository.saveAll(Arrays.asList(desafio1, desafio2, desafio3));

            System.out.println("Trilha inicial carregada com sucesso! 🚀");
        }
    }
}