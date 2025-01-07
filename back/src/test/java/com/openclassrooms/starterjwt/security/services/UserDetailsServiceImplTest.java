package com.openclassrooms.starterjwt.security.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    private User sampleUser;

    @BeforeEach
    public void setUp() {
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setEmail("test@gmail.com");
        sampleUser.setFirstName("Test");
        sampleUser.setLastName("User");
        sampleUser.setPassword("password");
    }

    @Test
    public void testLoadUserByUsername_Success() {
        // Arrange
        when(userRepository.findByEmail("test@gmail.com")).thenReturn(Optional.of(sampleUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername("test@gmail.com");

        // Assert
        assertNotNull(userDetails);
        assertEquals("test@gmail.com", userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
        verify(userRepository, times(1)).findByEmail("test@gmail.com");
    }

    @Test
    public void testLoadUserByUsername_UserNotFound() {
        // Arrange
        when(userRepository.findByEmail("notfound@gmail.com")).thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername("notfound@gmail.com")
        );
        assertEquals("User Not Found with email: notfound@gmail.com", exception.getMessage());
        verify(userRepository, times(1)).findByEmail("notfound@gmail.com");
    }
}

