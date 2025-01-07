package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SessionMapperTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private UserService userService;

    @InjectMocks
    private final SessionMapper sessionMapper = Mappers.getMapper(SessionMapper.class);

    private User mockUser1;
    private User mockUser2;

    @BeforeEach
    void setUp() {
        mockUser1 = new User();
        mockUser1.setId(1L);

        mockUser2 = new User();
        mockUser2.setId(2L);
    }

    @Test
    void givenSessionDto_whenToEntity_thenMapsCorrectly() {
        // Arrange
        SessionDto sessionDto = new SessionDto();
        sessionDto.setDescription("Test Description");
        sessionDto.setTeacher_id(10L);
        sessionDto.setUsers(Arrays.asList(1L, 2L));

        when(teacherService.findById(10L)).thenReturn(new Teacher()); // Mocked teacher
        when(userService.findById(1L)).thenReturn(mockUser1);
        when(userService.findById(2L)).thenReturn(mockUser2);

        // Act
        Session session = sessionMapper.toEntity(sessionDto);

        // Assert
        assertNotNull(session);
        assertEquals("Test Description", session.getDescription());
        assertNotNull(session.getTeacher());
        assertEquals(2, session.getUsers().size());
        verify(teacherService).findById(10L);
        verify(userService).findById(1L);
        verify(userService).findById(2L);
    }

    @Test
    void givenSession_whenToDto_thenMapsCorrectly() {
        // Arrange
        Teacher teacher = new Teacher();
        teacher.setId(10L);

        Session session = new Session();
        session.setDescription("Test Description");
        session.setTeacher(teacher);
        session.setUsers(Arrays.asList(mockUser1, mockUser2));

        // Act
        SessionDto sessionDto = sessionMapper.toDto(session);

        // Assert
        assertNotNull(sessionDto);
        assertEquals("Test Description", sessionDto.getDescription());
        assertEquals(10L, sessionDto.getTeacher_id());
        assertEquals(2, sessionDto.getUsers().size());
        assertTrue(sessionDto.getUsers().contains(1L));
        assertTrue(sessionDto.getUsers().contains(2L));
    }

    @Test
    void givenSessionDtoWithNullUsers_whenToEntity_thenMapsEmptyList() {
        // Arrange
        SessionDto sessionDto = new SessionDto();
        sessionDto.setDescription("Test Description");

        // Act
        Session session = sessionMapper.toEntity(sessionDto);

        // Assert
        assertNotNull(session);
        assertEquals("Test Description", session.getDescription());
        assertTrue(session.getUsers().isEmpty());
    }

    @Test
    void givenSessionWithNullUsers_whenToDto_thenMapsEmptyList() {
        // Arrange
        Session session = new Session();
        session.setDescription("Test Description");

        // Act
        SessionDto sessionDto = sessionMapper.toDto(session);

        // Assert
        assertNotNull(sessionDto);
        assertEquals("Test Description", sessionDto.getDescription());
        assertTrue(sessionDto.getUsers().isEmpty());
    }
}
