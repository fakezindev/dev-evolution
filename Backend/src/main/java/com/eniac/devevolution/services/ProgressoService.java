package com.eniac.devevolution.services;

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

        // 1. Busca os envolvidos
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Estudante não encontrado"));

        Desafio desafio = desafioRepository.findById(desafioId)
                .orElseThrow(() -> new RuntimeException("Desafio não encontrado"));

        // 2. Busca se já existe um progresso salvo. Se não existir, cria um na memória.
        ProgressoAluno progresso = progressoRepository.findByStudentIdAndDesafioId(student.getId(), desafio.getId())
                .orElse(new ProgressoAluno());

        boolean jaEstavaConcluido = Boolean.TRUE.equals(progresso.getConcluido());
        int maxVidas = 5; // O limite máximo de corações da sua UI
        String mensagemModal;
        int xpGanho = 0;

        // 3. Regras do Jogo
        if (sucesso) {
            // CASO A: PRIMEIRA VITÓRIA (Ganha XP)
            if (!jaEstavaConcluido) {
                xpGanho = desafio.getXpRecompensa(); // Pega o XP direto do banco (ex: 50, 100)
                student.setXpTotal(student.getXpTotal() + xpGanho);

                progresso.setStudent(student);
                progresso.setDesafio(desafio);
                progresso.setConcluido(true);
                progresso.setDataConclusao(LocalDateTime.now());


                mensagemModal = "Você ganhou +" + xpGanho + " XP! Seu saldo subiu para " + student.getXpTotal() + " XP 🏆";

                // Garantia contra bugs: se ele passou de primeira, mas estava com 0 vidas, resgata ele para 1
                if (student.getVidasAtuais() <= 0) student.setVidasAtuais(1);
            }
            // CASO B: REVISÃO / RECUPERAÇÃO (A fonte de cura)
            else {
                if (student.getVidasAtuais() < maxVidas) {
                    student.setVidasAtuais(student.getVidasAtuais() + 1);
                    mensagemModal = "Revisão perfeita! Você recuperou 1 coração ❤️";
                } else {
                    mensagemModal = "Revisão concluída! Suas vidas já estão no máximo.";
                }
            }

            progressoRepository.save(progresso);

        } else {
            // CASO C: ERROU (Toma dano)
            if (student.getVidasAtuais() > 0) {
                student.setVidasAtuais(student.getVidasAtuais() - 1);
            }
            mensagemModal = "Ops! Código incorreto. Você perdeu 1 vida 💔";
        }

        // 4. salva o perfil e devolve o DTO completo para o React!
        studentRepository.save(student);

        return new ProgressoResponseDTO(mensagemModal, student.getXpTotal(), student.getVidasAtuais(), progresso.getConcluido());
    }

    @Transactional
    public void resetarProgresso(String username) {
        Student student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Estudante não encontrado"));

        // 1. Apaga o histórico de lições concluídas desse aluno
        progressoRepository.deleteByStudent(student);

        // 2. Zera o XP e devolve as 5 vidas iniciais
        student.setXpTotal(0);
        student.setVidasAtuais(5);

        // 3. salva o aluno "zerado"
        studentRepository.save(student);
    }
}