package com.eniac.devevolution.services;

import com.eniac.devevolution.dtos.ProgressoRequestDTO;
import com.eniac.devevolution.dtos.ProgressoResponseDTO;
import com.eniac.devevolution.entities.Desafio;
import com.eniac.devevolution.entities.ProgressoAluno;
import com.eniac.devevolution.entities.Student;
import com.eniac.devevolution.repositories.DesafioRepository;
import com.eniac.devevolution.repositories.ProgressoAlunoRepository;
import com.eniac.devevolution.repositories.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ProgressoService {

    @Autowired
    private ProgressoAlunoRepository progressoRepository;

    @Autowired
    private DesafioRepository desafioRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Transactional
    public ProgressoResponseDTO submeterProgresso(Long desafioId, boolean sucesso, String username) {
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Estudante não encontrado"));

        Desafio desafio = desafioRepository.findById(desafioId)
                .orElseThrow(() -> new RuntimeException("Desafio não encontrado"));

        // 1. Verifica se ele já tinha concluído (usando o metodo novo do repositório)
        boolean jaConcluiuAnteriormente = progressoRepository.existsByStudentAndDesafioAndConcluidoTrue(student, desafio);

        if (sucesso) {
            int xpGanho = 0;

            // 🛡️ CORREÇÃO DA REGRA DE RECUPERAÇÃO:
            // Não importa se é revisão ou primeira vez. Se ele acertou e estava zerado, ele ganha 1 vida!
            if (student.getVidasAtuais() <= 0) {
                student.setVidasAtuais(1);
                System.out.println("Cura ativada para o aluno: " + username);
            }

            // ⚡ REGRA DE XP E SALVAMENTO:
            // Só ganha o XP e cria o registro na tabela se for a PRIMEIRA vitória
            if (!jaConcluiuAnteriormente) {
                xpGanho = 50;
                student.setXpTotal(student.getXpTotal() + xpGanho);

                ProgressoAluno novoProgresso = new ProgressoAluno();
                novoProgresso.setStudent(student);
                novoProgresso.setDesafio(desafio);
                novoProgresso.setConcluido(true);
                novoProgresso.setDataConclusao(LocalDateTime.now());

                progressoRepository.save(novoProgresso);
            }

            studentRepository.save(student);

            // Passando a ordem correta para o DTO que corrigimos no passo anterior!
            return new ProgressoResponseDTO(
                    "Missão concluída com sucesso!",
                    xpGanho,
                    student.getVidasAtuais(),
                    true
            );

        } else {
            // 💔 REGRA DE DANO:
            if (student.getVidasAtuais() > 0) {
                student.setVidasAtuais(student.getVidasAtuais() - 1);
                studentRepository.save(student);
            }

            // CORREÇÃO AQUI: O texto (mensagem) vem primeiro!
            return new ProgressoResponseDTO(
                    "Código incorreto. Você perdeu uma vida.",
                    0,
                    student.getVidasAtuais(),
                    false
            );
        }
    }

    @Transactional // Garante que se der erro no meio, o banco desfaz tudo e o aluno não perde vida à toa
    public ProgressoResponseDTO processarSubmissao(String username, ProgressoRequestDTO dto) {

        // 1. Busca quem está jogando e qual é o desafio
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado: " + username));

        Desafio desafio = desafioRepository.findById(dto.desafioId())
                .orElseThrow(() -> new RuntimeException("Desafio não encontrado."));

        // 2. Procura se ele já tentou esse desafio antes. Se não, cria um progresso novo.
        ProgressoAluno progresso = progressoRepository.findByStudentIdAndDesafioId(student.getId(), desafio.getId())
                .orElse(new ProgressoAluno());

        progresso.setStudent(student);
        progresso.setDesafio(desafio);
        progresso.setCodigoSubmetido(dto.codigoSubmetido());
        progresso.setDataConclusao(LocalDateTime.now());

        String mensagem;

        // 3. Regras de Gamificação (XP e Vidas)
        if (dto.sucesso()) {
            // Só ganha XP se for a primeira vez que passa (evita "farmar" XP no mesmo desafio)
            if (!Boolean.TRUE.equals(progresso.getConcluido())) {
                student.setXpTotal(student.getXpTotal() + desafio.getXpRecompensa());
                progresso.setConcluido(true);
            }
            mensagem = "Desafio concluído com sucesso! Você ganhou " + desafio.getXpRecompensa() + " XP 🏆";
        } else {
            // Se errou, tira 1 vida (mas não deixa ficar negativo)
            if (student.getVidasAtuais() > 0) {
                student.setVidasAtuais(student.getVidasAtuais() - 1);
            }
            mensagem = "Ops! Código incorreto. Você perdeu 1 vida ❤️";
        }

        // 4. Salva o status do desafio e o perfil atualizado do aluno
        progressoRepository.save(progresso);
        studentRepository.save(student);

        // 5. Devolve o status fresquinho para o front-end atualizar as barrinhas
        return new ProgressoResponseDTO(mensagem, student.getXpTotal(), student.getVidasAtuais(), progresso.getConcluido());
    }

    @Transactional
    // 1. Mudamos de 'void' para 'boolean'
    public boolean processarSubmissaoPrincipal(Long studentId, Long desafioId, boolean sucesso) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        boolean xpAdicionado = false; // Começa como falso

        if (sucesso) {
            Optional<ProgressoAluno> progressoExistente = progressoRepository.findByStudentIdAndDesafioId(student.getId(), desafioId);

            if (progressoExistente.isEmpty()) {
                student.setXpTotal(student.getXpTotal() + 50);
                xpAdicionado = true; // Opa! Ganhou XP!

                Desafio desafio = desafioRepository.findById(desafioId).orElseThrow();
                ProgressoAluno novoProgresso = new ProgressoAluno();
                novoProgresso.setStudent(student);
                novoProgresso.setDesafio(desafio);
                progressoRepository.save(novoProgresso);
            }
        } else {
            student.setVidasAtuais(Math.max(0, student.getVidasAtuais() - 1));
        }

        studentRepository.save(student);

        // 2. Retorna a fofoca para o Controller
        return xpAdicionado;
    }

    @Transactional
    public void processarSubmissaoRecuperacao(Long studentId, boolean sucesso) {
        Student student = studentRepository.findById(studentId).orElseThrow();

        // O aluno só pode recuperar vida se tiver menos de 3 (o máximo)
        if (student.getVidasAtuais() >= 3) {
            throw new RuntimeException("Você já está com as vidas cheias!");
        }

        if (sucesso) {
            // Se ele acertou o exercício de reforço, ganha 1 coração!
            // (Opcional: você pode dar um pouquinho de XP aqui também, tipo 10 XP)
            student.setVidasAtuais(student.getVidasAtuais() + 1);
            student.setXpTotal(student.getXpTotal() + 10);

            studentRepository.save(student);
        }
        // Se ele errar a recuperação, nada acontece (ele continua com 0 vidas até acertar).
    }
}