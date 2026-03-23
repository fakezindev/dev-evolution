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

@Service
public class ProgressoService {

    @Autowired
    private ProgressoAlunoRepository progressoRepository;

    @Autowired
    private DesafioRepository desafioRepository;

    @Autowired
    private StudentRepository studentRepository;

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
}