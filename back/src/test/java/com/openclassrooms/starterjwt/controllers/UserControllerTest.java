package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

    @InjectMocks
    private UserController userController;

    @Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    private User sampleUser;
    private UserDto sampleUserDto;

    @BeforeEach
    public void setUp() {
        // Crée un utilisateur fictif pour les tests
        sampleUser = new User();
        sampleUser.setId(1L);
        sampleUser.setEmail("test@example.com");
        sampleUser.setFirstName("Test");
        sampleUser.setLastName("User");
        sampleUser.setPassword("password");
        sampleUser.setAdmin(false);
        
        sampleUserDto = new UserDto();
        sampleUserDto.setId(1L);
        sampleUserDto.setEmail("test@example.com");
        sampleUserDto.setFirstName("Test");
        sampleUserDto.setLastName("User");
        sampleUserDto.setPassword("password");
        sampleUserDto.setAdmin(false);
    }

    @Test
    public void testFindById_Success() {
        // Arrange
        when(userService.findById(1L)).thenReturn(sampleUser);
        when(userMapper.toDto(sampleUser)).thenReturn(sampleUserDto);

        // Act
        ResponseEntity<?> response = userController.findById("1");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(sampleUserDto, response.getBody());
        verify(userService, times(1)).findById(1L);
        verify(userMapper, times(1)).toDto(sampleUser);
    }

    @Test
    public void testFindById_NotFound() {
        // Arrange
        when(userService.findById(1L)).thenReturn(null);

        // Act
        ResponseEntity<?> response = userController.findById("1");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        //verify(userService, times(1)).findById(1L);
        //verify(userMapper, never()).toDto(any());
    }

    @Test
    public void testFindById_BadRequest() {
        // Act
        ResponseEntity<?> response = userController.findById("invalid");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        //verify(userService, never()).findById(anyLong());
        //verify(userMapper, never()).toDto(any());
    }

    @Test
    public void testDelete_Success() {
        // Arrange
        when(userService.findById(1L)).thenReturn(sampleUser);
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("test@example.com");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        SecurityContextHolder.setContext(securityContext);

        // Act
        ResponseEntity<?> response = userController.save("1");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(userService, times(1)).delete(1L);
    }

    @Test
    public void testDelete_Unauthorized() {
        // Arrange
        when(userService.findById(1L)).thenReturn(sampleUser);
        UserDetails userDetails = mock(UserDetails.class);
        when(userDetails.getUsername()).thenReturn("different@example.com");
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        SecurityContextHolder.setContext(securityContext);

        // Act
        ResponseEntity<?> response = userController.save("1");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(userService, never()).delete(1L);
    }

    @Test
    public void testDelete_NotFound() {
        // Arrange
        when(userService.findById(1L)).thenReturn(null);

        // Act
        ResponseEntity<?> response = userController.save("1");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        verify(userService, never()).delete(anyLong());
    }

    @Test
    public void testDelete_BadRequest() {
        // Act
        ResponseEntity<?> response = userController.save("invalid");

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(userService, never()).findById(anyLong());
        verify(userService, never()).delete(anyLong());
    }
}
