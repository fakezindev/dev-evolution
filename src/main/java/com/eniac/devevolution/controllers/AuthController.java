package com.eniac.devevolution.controllers;

import com.eniac.devevolution.dtos.AuthRequest;
import com.eniac.devevolution.dtos.AuthResponse;
import com.eniac.devevolution.dtos.RegisterRequest;
import com.eniac.devevolution.entities.Student;
import com.eniac.devevolution.entities.User;
import com.eniac.devevolution.repositories.StudentRepository;
import com.eniac.devevolution.repositories.UserRepository;
import com.eniac.devevolution.services.JwtService;
import com.eniac.devevolution.services.UserService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @Transactional // Mágica: Ou salva TUDO, ou não salva NADA!
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid RegisterRequest data) {

        // 1. Verifica se o username já está em uso (na tb_users)
        if (userRepository.findByUsername(data.username()).isPresent()) {
            return ResponseEntity.badRequest().body("Nome de usuário já está em uso!");
        }

        // 2. Cria a credencial de acesso (tb_users)
        User newUser = new User();
        newUser.setUsername(data.username());
        newUser.setPassword(passwordEncoder.encode(data.password()));
        newUser.setPerfil("ALUNO"); // Nível de acesso padrão
        userRepository.save(newUser);

        // 3. Cria o perfil do jogo (tb_students)
        Student newStudent = new Student();
        newStudent.setUsername(data.username());
        newStudent.setEmail(data.email());
        newStudent.setCurso("Iniciante");
        newStudent.setXpTotal(0); // Começa zerado
        newStudent.setVidasAtuais(3); // Começa com 3 vidas
        studentRepository.save(newStudent);

        // Retorna sucesso para o Front-end!
        return ResponseEntity.status(HttpStatus.CREATED).body("Conta e perfil criados com sucesso!");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));

        User user = userService.findByUsername(request.username());
        String token = jwtService.generateToken(user.getUsername(), user.getPerfil());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
