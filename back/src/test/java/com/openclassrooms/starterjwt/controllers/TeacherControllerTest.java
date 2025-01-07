package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeacherControllerTest {

    @InjectMocks
    private TeacherController teacherController;

    @Mock
    private TeacherService teacherService;

    @Mock
    private TeacherMapper teacherMapper;

    private Teacher sampleTeacher;
    private TeacherDto sampleTeacherDto;

    @BeforeEach
    public void setUp() {
        // Préparer un enseignant fictif pour les tests
        sampleTeacher = new Teacher();
        sampleTeacher.setId(1L);
        sampleTeacher.setLastName("User");
        sampleTeacher.setFirstName("Test");
        
        sampleTeacherDto = new TeacherDto();
        sampleTeacherDto.setId(1L);
        sampleTeacherDto.setLastName("User");
        sampleTeacherDto.setFirstName("Test");
    }

    @Test
    public void testFindById_Success() {
        // Arrange
        when(teacherService.findById(1L)).thenReturn(sampleTeacher);
        when(teacherMapper.toDto(sampleTeacher)).thenReturn(sampleTeacherDto);

        // Act
        ResponseEntity<?> response = teacherController.findById("1");

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(sampleTeacherDto, response.getBody());
        verify(teacherService, times(1)).findById(1L);
        verify(teacherMapper, times(1)).toDto(sampleTeacher);
    }

    @Test
    public void testFindById_NotFound() {
        // Arrange
        when(teacherService.findById(1L)).thenReturn(null);

        // Act
        ResponseEntity<?> response = teacherController.findById("1");

        // Assert
        assertNotNull(response);
        assertEquals(404, response.getStatusCodeValue());
        //verify(teacherService, times(1)).findById(1L);
        //verify(teacherMapper, never()).toDto(any());
    }

    @Test
    public void testFindById_BadRequest() {
        // Act
        ResponseEntity<?> response = teacherController.findById("invalid");

        // Assert
        assertNotNull(response);
        assertEquals(400, response.getStatusCodeValue());
       // verify(teacherService, never()).findById(anyLong());
        //verify(teacherMapper, never()).toDto(any());
    }

    @Test
    public void testFindAll_Success() {
        // Arrange
        List<Teacher> teachers = Arrays.asList(sampleTeacher);
        List<TeacherDto> teacherDtos = Arrays.asList(sampleTeacherDto);
        
        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(teacherDtos);

        // Act
        ResponseEntity<?> response = teacherController.findAll();

        // Assert
        assertNotNull(response);
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(teacherDtos, response.getBody());
        verify(teacherService, times(1)).findAll();
        verify(teacherMapper, times(1)).toDto(teachers);
    }
}
