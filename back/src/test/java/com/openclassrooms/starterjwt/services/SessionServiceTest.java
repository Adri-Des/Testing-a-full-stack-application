package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;

import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateSession() {
        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session createdSession = sessionService.create(session);

        assertNotNull(createdSession);
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testDeleteSession() {
        Long sessionId = 1L;
        doNothing().when(sessionRepository).deleteById(sessionId);

        sessionService.delete(sessionId);

        verify(sessionRepository, times(1)).deleteById(sessionId);
    }

    @Test
    void testFindAllSessions() {
        List<Session> sessions = new ArrayList<>();
        sessions.add(new Session());
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> result = sessionService.findAll();

        assertEquals(1, result.size());
        verify(sessionRepository, times(1)).findAll();
    }

    @Test
    void testGetSessionByIdFound() {
        Long sessionId = 1L;
        Session session = new Session();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        Session result = sessionService.getById(sessionId);

        assertNotNull(result);
        verify(sessionRepository, times(1)).findById(sessionId);
    }

    @Test
    void testGetSessionByIdNotFound() {
        Long sessionId = 1L;
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        Session result = sessionService.getById(sessionId);

        assertNull(result);
        verify(sessionRepository, times(1)).findById(sessionId);
    }

    @Test
    void testUpdateSession() {
        Long sessionId = 1L;
        Session session = new Session();
        session.setId(sessionId);
        when(sessionRepository.save(session)).thenReturn(session);

        Session updatedSession = sessionService.update(sessionId, session);

        assertNotNull(updatedSession);
        assertEquals(sessionId, updatedSession.getId());
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testParticipateInSessionSuccessfully() {
        Long sessionId = 1L;
        Long userId = 2L;
        Session session = new Session();
        session.setUsers(new ArrayList<>());
        User user = new User();
        user.setId(userId);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(sessionRepository.save(session)).thenReturn(session);

        sessionService.participate(sessionId, userId);

        assertTrue(session.getUsers().contains(user));
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testParticipateInSessionNotFound() {
        Long sessionId = 1L;
        Long userId = 2L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, userId));
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    void testParticipateInSessionAlreadyParticipating() {
        Long sessionId = 1L;
        Long userId = 2L;
        User user = new User();
        user.setId(userId);
        Session session = new Session();
        session.setUsers(Arrays.asList(user));

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(sessionId, userId));
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    void testNoLongerParticipateSuccessfully() {
        Long sessionId = 1L;
        Long userId = 2L;
        User user = new User();
        user.setId(userId);
        Session session = new Session();
        session.setUsers(new ArrayList<>(Arrays.asList(user)));

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(sessionRepository.save(session)).thenReturn(session);

        sessionService.noLongerParticipate(sessionId, userId);

        assertFalse(session.getUsers().contains(user));
        verify(sessionRepository, times(1)).save(session);
    }

    @Test
    void testNoLongerParticipateNotFound() {
        Long sessionId = 1L;
        Long userId = 2L;

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
        verify(sessionRepository, never()).save(any(Session.class));
    }

    @Test
    void testNoLongerParticipateNotParticipating() {
        Long sessionId = 1L;
        Long userId = 2L;
        Session session = new Session();
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(sessionId, userId));
        verify(sessionRepository, never()).save(any(Session.class));
    }
}
