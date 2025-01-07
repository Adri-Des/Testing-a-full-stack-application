package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.SessionDto;

import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class) // Intègre Mockito avec JUnit 5
public class SessionControllerTest {

    @InjectMocks
    private SessionController sessionController;

    @Mock
    private SessionService sessionService;

    @Mock
    private SessionMapper sessionMapper;

    private Session sampleSession;
    private SessionDto sampleSessionDto;

    @BeforeEach
    public void setUp() {
        // Préparation des objets de test
        sampleSession = new Session();
        sampleSession.setId(1L);
        sampleSession.setName("Sample Session");
        sampleSession.setDate(new Date());
        sampleSession.setTeacher(null);
        sampleSession.setDescription("Sample description");

        sampleSessionDto = new SessionDto();
        sampleSessionDto.setId(1L);
        sampleSessionDto.setName("Sample Session");
        sampleSessionDto.setDate(new Date());
        sampleSessionDto.setTeacher_id(1L);
        sampleSessionDto.setDescription("Sample description");
    }

    @Test
    public void testFindById_Success() {
        when(sessionService.getById(1L)).thenReturn(sampleSession);
        when(sessionMapper.toDto(sampleSession)).thenReturn(sampleSessionDto);

        ResponseEntity<?> response = sessionController.findById("1");

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(sampleSessionDto, response.getBody());
    }

    @Test
    public void testFindAll_Success() {
        List<Session> sessions = Arrays.asList(sampleSession);
        List<SessionDto> sessionDtos = Arrays.asList(sampleSessionDto);

        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(sessions)).thenReturn(sessionDtos);

        ResponseEntity<?> response = sessionController.findAll();

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(sessionDtos, response.getBody());
    }

    @Test
    public void testCreate_Success() {
        when(sessionMapper.toEntity(any(SessionDto.class))).thenReturn(sampleSession);
        when(sessionService.create(sampleSession)).thenReturn(sampleSession);
        when(sessionMapper.toDto(sampleSession)).thenReturn(sampleSessionDto);

        ResponseEntity<?> response = sessionController.create(sampleSessionDto);

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(sampleSessionDto, response.getBody());
    }

    @Test
    public void testUpdate_Success() {
    	when(sessionMapper.toEntity(sampleSessionDto)).thenReturn(sampleSession);
        when(sessionService.update(1L, sampleSession)).thenReturn(sampleSession);
        when(sessionMapper.toDto(sampleSession)).thenReturn(sampleSessionDto);

        ResponseEntity<?> response = sessionController.update("1", sampleSessionDto);

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(sampleSessionDto, response.getBody());
    }

    @Test
    public void testDelete_Success() {
        when(sessionService.getById(1L)).thenReturn(sampleSession);

        ResponseEntity<?> response = sessionController.save("1");

        Mockito.verify(sessionService).delete(1L);

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    public void testParticipate_Success() {
        Mockito.doNothing().when(sessionService).participate(1L, 1L);

        ResponseEntity<?> response = sessionController.participate("1", "1");

        Mockito.verify(sessionService).participate(1L, 1L);

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }

    @Test
    public void testNoLongerParticipate_Success() {
        Mockito.doNothing().when(sessionService).noLongerParticipate(1L, 1L);

        ResponseEntity<?> response = sessionController.noLongerParticipate("1", "1");

        Mockito.verify(sessionService).noLongerParticipate(1L, 1L);

        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
    }
}
