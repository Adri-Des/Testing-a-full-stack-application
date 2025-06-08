package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.dto.TeacherDto;
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

import java.security.PrivateKey;
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
    private Teacher mockTeacher1;
    private Teacher mockTeacher2;

    @BeforeEach
    void setUp() {
        mockUser1 = new User();
        mockUser1.setId(1L);

        mockUser2 = new User();
        mockUser2.setId(2L);
        
        mockTeacher1 = new Teacher();
        mockTeacher1.setId(10L);
        
        mockTeacher2 = new Teacher();
        mockTeacher2.setId(11L);
    }

    @Test
    void givenSessionDto_whenToEntity_thenMapsCorrectly() {
        // Arrange
        SessionDto sessionDto = new SessionDto();
        sessionDto.setDescription("Test Description");
        sessionDto.setTeacher_id(10L);
        sessionDto.setUsers(Arrays.asList(mockUser1.getId(), (mockUser2.getId())));

        when(teacherService.findById(10L)).thenReturn(mockTeacher1); 
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
        Session session = new Session();
        session.setDescription("Test Description");
        session.setTeacher(mockTeacher1);
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
    void givenSessionDtoListToEntityList() {
        // Arrange
        SessionDto dto1 = new SessionDto();
        dto1.setId(1L);
        dto1.setDescription("Session 1");
        dto1.setTeacher_id(10L);
        dto1.setUsers(Arrays.asList(mockUser1.getId(), (mockUser2.getId())));

        SessionDto dto2 = new SessionDto();
        dto2.setId(2L);
        dto2.setDescription("Session 2");
        dto2.setTeacher_id(11L);
        dto2.setUsers(Arrays.asList(mockUser2.getId()));


        when(teacherService.findById(10L)).thenReturn(mockTeacher1);
        when(teacherService.findById(11L)).thenReturn(mockTeacher2);
        when(userService.findById(1L)).thenReturn(mockUser1);
        when(userService.findById(2L)).thenReturn(mockUser2);

        List<SessionDto> dtoList = List.of(dto1, dto2);

        // Act
        List<Session> sessions = sessionMapper.toEntity(dtoList);

        // Assert
        assertNotNull(sessions);
        assertEquals(2, sessions.size());

        assertEquals("Session 1", sessions.get(0).getDescription());
        assertEquals(10L, sessions.get(0).getTeacher().getId());
        assertEquals(2, sessions.get(0).getUsers().size());

        assertEquals("Session 2", sessions.get(1).getDescription());
        assertEquals(11L, sessions.get(1).getTeacher().getId());
        assertEquals(1, sessions.get(1).getUsers().size());
    }
    
    
    @Test
    void givenNullDto_whenToEntity_thenReturnNull() {
        Session session = sessionMapper.toEntity((SessionDto)null);
        assertNull(session);
    }
    
    @Test
    void givenNullSession_whentoDto_thenReturnNull() {
        // Act
        SessionDto sessionDto = sessionMapper.toDto((Session)null);

        // Assert
        assertNull(sessionDto);
    }
    
    @Test
    void givenNullDtoList_whenToEntity_thenReturnNull() {
        // Act
        List<Session> sessions = sessionMapper.toEntity((List<SessionDto>)null);

        // Assert
        assertNull(sessions);
    }
}
