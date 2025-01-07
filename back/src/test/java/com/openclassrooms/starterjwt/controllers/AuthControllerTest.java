package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.models.User;

import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoginSuccess() {
        // Mocked request and response
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("user@test.com");
        loginRequest.setPassword("passwordtest");

        Authentication authentication = mock(Authentication.class);
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "usertest", "User", "Test", false, "passwordtest");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtUtils.generateJwtToken(authentication)).thenReturn("mockedJwtToken");
        when(userRepository.findByEmail("user@test.com")).thenReturn(java.util.Optional.of(new User()));

        // Call the method
        ResponseEntity<?> response = authController.authenticateUser(loginRequest);

        // Verify the response
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(((JwtResponse) response.getBody()).getToken()).isEqualTo("mockedJwtToken");

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void testRegisterSuccess() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("newuser@test.com");
        signupRequest.setPassword("password");
        signupRequest.setLastName("Test");
        signupRequest.setFirstName("User");

        when(userRepository.existsByEmail("newuser@test.com")).thenReturn(false);
        
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        
        User mockUser = new User(signupRequest.getEmail(), signupRequest.getLastName(), signupRequest.getFirstName(),
        		"encodedPassword", false);
        
        when(userRepository.save(any(User.class))).thenReturn(mockUser);

        ResponseEntity<?> response = authController.registerUser(signupRequest);

        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(((MessageResponse) response.getBody()).getMessage())
                .isEqualTo("User registered successfully!");

        verify(userRepository).existsByEmail("newuser@test.com");
        verify(userRepository).save(any(User.class));
        verify(passwordEncoder).encode("password");
    }

    @Test
    void testRegisterEmailAlreadyExists() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("existinguser@test.com");
        signupRequest.setPassword("passwordtest");
        signupRequest.setLastName("Test");
        signupRequest.setFirstName("User");

        when(userRepository.existsByEmail("existinguser@test.com")).thenReturn(true);

        ResponseEntity<?> response = authController.registerUser(signupRequest);

        assertThat(response.getStatusCodeValue()).isEqualTo(400);
        assertThat(((MessageResponse) response.getBody()).getMessage())
                .isEqualTo("Error: Email is already taken!");

        verify(userRepository).existsByEmail("existinguser@test.com");
        verify(userRepository, never()).save(any(User.class));
    }
}
