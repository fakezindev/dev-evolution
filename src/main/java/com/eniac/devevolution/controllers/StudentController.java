package com.eniac.devevolution.controllers;

import com.eniac.devevolution.dtos.RegisterRequest;
import com.eniac.devevolution.dtos.StudentResponse;
import com.eniac.devevolution.repositories.StudentRepository;
import com.eniac.devevolution.services.StudentService;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/alunos")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<StudentResponse> create(@RequestBody @Valid RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<StudentResponse>> findAll() {
        return ResponseEntity.ok(studentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentResponse> update(@PathVariable Long id, @RequestBody @Valid RegisterRequest request) {
        return ResponseEntity.ok(studentService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        studentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/meu-perfil")
    public ResponseEntity<StudentResponse> buscarMeuPerfil(Authentication authentication) {

        // Pega o nome do usuário que está dentro do Token JWT
        String username = authentication.getName();

        // Busca o aluno no banco
        var student = studentRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        List<Long> desafiosConcluidos = new ArrayList<>();
        if (student.getProgressos() != null) {
            desafiosConcluidos = student.getProgressos().stream()
                    .map(progresso -> progresso.getDesafio().getId())
                    .toList();
        }

        // 2. Agora sim passamos a lista de Long para o DTO
        StudentResponse response = new StudentResponse(
                student.getId(),
                student.getUsername(),
                student.getEmail(),
                student.getCurso(),
                student.getDataNascimento(),
                student.getXpTotal(),
                student.getVidasAtuais(),
                desafiosConcluidos // <-- Agora a tipagem está correta!
        );

        return ResponseEntity.ok(response);
    }
}
