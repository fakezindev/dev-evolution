package com.eniac.devevolution.config;

import com.eniac.devevolution.entities.Desafio;
import com.eniac.devevolution.entities.Mundo;
import com.eniac.devevolution.entities.Trilha;
import com.eniac.devevolution.repositories.DesafioRepository;
import com.eniac.devevolution.repositories.MundoRepository;
import com.eniac.devevolution.repositories.ProgressoAlunoRepository;
import com.eniac.devevolution.repositories.TrilhaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class SeederConfig implements CommandLineRunner {

    @Autowired
    private TrilhaRepository trilhaRepository;

    @Autowired
    private MundoRepository mundoRepository;

    @Autowired
    private DesafioRepository desafioRepository;

    @Autowired
    private ProgressoAlunoRepository progressoRepository;

    @Override
    public void run(String... args) throws Exception {

        // 🧹 APAGADOR TEMPORÁRIO
        // progressoRepository.deleteAll();
        // desafioRepository.deleteAll();
        // mundoRepository.deleteAll();
        // trilhaRepository.deleteAll();

        // 🛡️ A PROTEÇÃO: Só vai inserir se o banco tiver menos de 5 lições!
        if (desafioRepository.count() < 5) {

            System.out.println("🚀 Populando o banco oficial do DevEvolution com a Trilha atualizada...");

            // 1. Criando a Trilha Principal
            Trilha trilhaJs = new Trilha();
            trilhaJs.setNome("JavaScript Evolution");
            trilhaJs.setDescricao("Aprenda lógica de programação do zero com JavaScript.");
            trilhaJs.setIconeUrl("https://dev-evolution.com/icons/js-icon.png");
            trilhaRepository.save(trilhaJs);

            // 2. Criando o Mundo 1 e Mundo 2
            Mundo mundo1 = new Mundo();
            mundo1.setTitulo("Mundo 1: Fundamentos e Variáveis");
            mundo1.setOrdem(1);
            mundo1.setTrilha(trilhaJs);

            Mundo mundo2 = new Mundo();
            mundo2.setTitulo("Mundo 2: Estruturas condicionais");
            mundo2.setOrdem(2);
            mundo2.setTrilha(trilhaJs);



            mundoRepository.save(mundo1);
            mundoRepository.save(mundo2);

            // 3. Cadastrando as Lições Oficiais!

            // Lições Mundo 1
            Desafio desafio1 = new Desafio();
            desafio1.setTitulo("Hello World");
            desafio1.setDescricaoMarkdown("Use `console.log()` para imprimir a mensagem na tela.");
            desafio1.setCodigoInicial("console.log(\"Olá, Mundo!\");");
            desafio1.setXpRecompensa(50);
            desafio1.setMundo(mundo1);

            Desafio desafio2 = new Desafio();
            desafio2.setTitulo("Organização e Variáveis");
            desafio2.setDescricaoMarkdown("Aprenda a organizar dados em gavetas (variáveis).");
            desafio2.setCodigoInicial("let nome = \"DevHero\";");
            desafio2.setXpRecompensa(100);
            desafio2.setMundo(mundo1);

            Desafio desafio3 = new Desafio();
            desafio3.setTitulo("Soma de Dois Números");
            desafio3.setDescricaoMarkdown("Crie uma calculadora simples usando `Number()` e `prompt()`.");
            desafio3.setCodigoInicial("let a = Number(prompt(\"N1\"));\nlet b = Number(prompt(\"N2\"));\nlet soma = a + b;\nconsole.log(soma);");
            desafio3.setXpRecompensa(150);
            desafio3.setMundo(mundo1);

            Desafio desafio4 = new Desafio();
            desafio4.setTitulo("Cálculo de Desconto");
            desafio4.setDescricaoMarkdown("Calcule um desconto e exiba o novo preço.");
            desafio4.setCodigoInicial("let preco = 100;\nlet desconto = 10;\nlet valorDesconto = preco * (desconto / 100);\nlet novoPreco = preco - valorDesconto;\nconsole.log(novoPreco);");
            desafio4.setXpRecompensa(200);
            desafio4.setMundo(mundo1);

            // 👑 A NOVA LIÇÃO: Boss do Mundo 1
            Desafio desafio5 = new Desafio();
            desafio5.setTitulo("Média Escolar");
            desafio5.setDescricaoMarkdown("Calcule a média de três notas e exiba com 2 casas decimais.");
            desafio5.setCodigoInicial("let nome = prompt(\"Nome:\");\nlet n1 = 7;\nlet n2 = 8;\nlet n3 = 10;\nlet media = (n1+n2+n3)/3;\nconsole.log(media.toFixed(2));");
            desafio5.setXpRecompensa(300);
            desafio5.setMundo(mundo1); // Atrelado ao Mundo 1 conforme solicitado

            // Lições Mundo 2

            Desafio desafio6 = new Desafio();
            desafio6.setTitulo("Par ou Ímpar");
            desafio6.setDescricaoMarkdown("O Conceito: Imagine que você tem um punhado de doces e quer dividi-los igualmente com um amigo.");
            desafio6.setCodigoInicial("// Vamos descobrir se 7 doces é par ou ímpar!\nlet doces = 7;\n// 1. Crie a variável 'resto' usando doces % 2\nlet resto = \n// 2. Mostre o 'resto' no console para descobrir!\n console.log(resto);");
            desafio6.setXpRecompensa(50);
            desafio6.setMundo(mundo2);

            Desafio desafio7 = new Desafio();
            desafio7.setTitulo("O Caminho do if/Else ");
            desafio7.setDescricaoMarkdown("O Conceito: Imagine que está a conduzir e chega a um cruzamento. A regra é simples: SE (if) o semáforo estiver verde, avança.SENÃO (else), tem de parar.");
            desafio7.setCodigoInicial("// O semáforo pode estar \"verde\" ou \"vermelho\" \n if (semaforo === \"verde\") { \n // O que fazer se estiver verde? \n } else { \n // O que fazer se não estiver verde? \n };");
            desafio7.setXpRecompensa(100);
            desafio7.setMundo(mundo2);

            Desafio desafio8 = new Desafio();
            desafio8.setTitulo("Radar de Ranks: If / Else If / Else");
            desafio8.setDescricaoMarkdown("Na guilda dos heróis, precisamos classificar os guerreiros com base na sua experiência (XP). Para isso, o if / else não é suficiente, pois temos 3 opções!");
            desafio8.setCodigoInicial("// O Radar de Ranks detectou um guerreiro!\n let xp = 2500;\n let rank = \"\";\n// 1. Crie o caminho para \"Novato\" (xp menor que 1000)\n if (xp < 1000) {\n rank = \"Novato\";\n}\n// 2. Crie o caminho para \"Explorador\" (xp até 5000) usando else if\n else if (xp <= 5000) {\n rank = \"Explorador\";\n}\n// 3. E para quem tem mais de 5000? Use o else para \"Mestre\" \n else {\n \n}\n// O Radar anuncia o resultado\n console.log(\"\uD83C\uDF1F Atenção! Um guerreiro rank \" + rank + \" se aproxima!\");");
            desafio8.setXpRecompensa(150);
            desafio8.setMundo(mundo2);

            Desafio desafio9 = new Desafio();
            desafio9.setTitulo("A Porta dos Guardiões: E / OU Lógico");
            desafio9.setDescricaoMarkdown("A Profecia: A Porta de Pedra está trancada há séculos. A lenda diz que ela só se abrirá para:Um aventureiro com o rank de \"Mestre\" ou Alguém que tenha a Chave de Cristal E Energia > 50");
            desafio9.setCodigoInicial("// O aventureiro diante da porta:\n let rank = \"Explorador\";\n let chaveDeCristal = true;\n let energia = 60;\n // Regra: A porta só abre se (O Rank for 'Mestre') \n // OU (Tiver a Chave E a energia for maior que 50) \n // Complete as condições dentro do if! \n if ( rank === \"Mestre\" || (chaveDeCristal === true && energia > 50) ) { \n console.log(\"✨ A Porta de Pedra ruge e se abre! Bem-vindo, herói!\"); \n } else { \n console.log(\"❌ A porta permanece selada. Volte quando for digno!\");}");
            desafio9.setXpRecompensa(200);
            desafio9.setMundo(mundo2);

            Desafio desafio10 = new Desafio();
            desafio10.setTitulo("");
            desafio10.setDescricaoMarkdown("");
            desafio10.setCodigoInicial("");
            desafio10.setXpRecompensa(300);
            desafio10.setMundo(mundo2);




            // A ordem aqui dita os IDs gerados pelo banco (1, 2, 3, 4, 5)
            desafioRepository.saveAll(Arrays.asList(desafio1, desafio2, desafio3, desafio4, desafio5, desafio6, desafio7, desafio8, desafio9, desafio10));

            System.out.println("✅ Mundos criados!");
        }
    }
}