package com.eniac.devevolution.services;

import com.eniac.devevolution.entities.User;
import com.eniac.devevolution.repositories.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Habilita o uso do Mockito com o JUnit 5
class UserServiceTest {

    @Mock
    private UserRepository userRepository; // "Finge" ser o banco de dados

    @InjectMocks
    private UserService userService; // A classe real que vamos testar

    @Test
    @DisplayName("Deve retornar UserDetails quando o aluno/professor existir no banco")
    void deveRetornarUserDetailsQuandoUsuarioExistir() {
        // 1. Cenário (Arrange): Preparamos os dados falsos
        String username = "aluno_dev";
        User usuarioMock = new User();
        usuarioMock.setUsername(username);
        usuarioMock.setPassword("senha123");
        usuarioMock.setPerfil("ALUNO");

        // Ensinamos o Mockito o que fazer quando o repository for chamado
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(usuarioMock));

        // 2. Ação (Act): Chamamos o metodo real
        UserDetails resultado = userService.loadUserByUsername(username);

        // 3. Verificação (Assert): Checamos se o Spring Security recebeu os dados certos
        assertNotNull(resultado);
        assertEquals(username, resultado.getUsername());
        assertEquals("senha123", resultado.getPassword());
        verify(userRepository, times(1)).findByUsername(username); // Garante que o banco foi consultado 1 vez
    }

    @Test
    @DisplayName("Deve lançar UsernameNotFoundException quando o usuário não existir")
    void deveLancarExcecaoQuandoUsuarioNaoExistir() {
        // 1. Cenário (Arrange): Banco vazio
        String username = "hacker";
        when(userRepository.findByUsername(username)).thenReturn(Optional.empty());

        // 2 & 3. Ação e Verificação (Act & Assert): Esperamos que a exceção estoure
        assertThrows(UsernameNotFoundException.class, () -> {
            userService.loadUserByUsername(username);
        });

        verify(userRepository, times(1)).findByUsername(username);
    }
}