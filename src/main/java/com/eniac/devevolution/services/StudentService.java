package com.eniac.devevolution.services;

import com.eniac.devevolution.dtos.RankingDTO;
import com.eniac.devevolution.dtos.RegisterRequest;
import com.eniac.devevolution.dtos.StudentResponse;
import com.eniac.devevolution.entities.Student;
import com.eniac.devevolution.repositories.StudentRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public StudentResponse create(RegisterRequest request) {
        if (studentRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Já existe um aluno com este e-mail.");
        }
        Student student = mapToEntity(new Student(), request);
        return toResponse(studentRepository.save(student));
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> findAll() {
        return studentRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    // Adicionado @Transactional para o JPA conseguir ler a lista de progressos associada ao aluno
    @Transactional(readOnly = true)
    public StudentResponse findById(Long id) {
        return studentRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado."));
    }

    public StudentResponse update(Long id, RegisterRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Aluno não encontrado."));

        if (!student.getEmail().equals(request.email()) && studentRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Já existe um aluno com este e-mail.");
        }

        mapToEntity(student, request);
        return toResponse(studentRepository.save(student));
    }

    public void delete(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new IllegalArgumentException("Aluno não encontrado.");
        }
        studentRepository.deleteById(id);
    }

    private Student mapToEntity(Student student, RegisterRequest request) {
        student.setUsername(request.username());
        student.setEmail(request.email());
        student.setCurso("Iniciante");
        return student;
    }

    // 🚀 O METODO SUBSTITUÍDO: Agora ele extrai os IDs dos desafios e manda para o front!
    private StudentResponse toResponse(Student student) {

        List<Long> desafiosConcluidos = new ArrayList<>();

        // Verifica se o aluno tem progressos para evitar NullPointerException
        if (student.getProgressos() != null) {
            desafiosConcluidos = student.getProgressos().stream()
                    .map(progresso -> progresso.getDesafio().getId()) // Pega só o ID!
                    .toList();
        }

        return new StudentResponse(
                student.getId(),
                student.getUsername(),
                student.getEmail(),
                student.getCurso(),
                student.getDataNascimento(),
                student.getXpTotal(),
                student.getVidasAtuais(),
                desafiosConcluidos // <-- O React agradece!
        );
    }

    // Adicione este metodo no seu StudentService
    @Transactional
    public void atualizarFotoPerfil(String usernameLogado, String novaFotoBase64) {
        Student student = studentRepository.findByUsername(usernameLogado)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        // Atualiza a foto e salva
        student.setFotoPerfil(novaFotoBase64);
        studentRepository.save(student);
    }

    public List<RankingDTO> obterRankingGeral() {
        List<Student> alunosOrdenados = studentRepository.findAllByOrderByXpTotalDesc();

        return alunosOrdenados.stream()
                .map(aluno -> new RankingDTO(
                        aluno.getId(),
                        aluno.getUsername(),
                        aluno.getXpTotal(),
                        aluno.getFotoPerfil(),
                        calcularLiga(aluno.getXpTotal())// Pegando a foto do banco
                ))
                .collect(Collectors.toList());
    }

    private String calcularLiga(int xp) {
        if (xp < 150) return "Bronze";
        if (xp < 300) return "Prata";
        if (xp < 500) return "Ouro";
        return "Diamante";
    }
}