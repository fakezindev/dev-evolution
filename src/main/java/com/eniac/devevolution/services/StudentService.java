package com.eniac.devevolution.services;

import com.eniac.devevolution.dtos.RegisterRequest;
import com.eniac.devevolution.dtos.StudentResponse;
import com.eniac.devevolution.entities.Student;
import com.eniac.devevolution.repositories.StudentRepository;

import java.util.ArrayList;
import java.util.List;
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
}