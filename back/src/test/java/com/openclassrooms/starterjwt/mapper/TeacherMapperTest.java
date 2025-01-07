package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class TeacherMapperTest {

    private final TeacherMapper teacherMapper = Mappers.getMapper(TeacherMapper.class);

    @Test
    void givenTeacherDto_whenToEntity_thenMapsCorrectly() {
        // Arrange
        TeacherDto teacherDto = new TeacherDto();
        teacherDto.setId(1L);
        teacherDto.setFirstName("Teacher");
        teacherDto.setLastName("Test");
       

        // Act
        Teacher teacher = teacherMapper.toEntity(teacherDto);

        // Assert
        assertNotNull(teacher);
        assertEquals(1L, teacher.getId());
        assertEquals("Teacher", teacher.getFirstName());
        assertEquals("Test", teacher.getLastName());
       
    }

    @Test
    void givenTeacher_whenToDto_thenMapsCorrectly() {
        // Arrange
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Jean");
        teacher.setLastName("Nette");
       

        // Act
        TeacherDto teacherDto = teacherMapper.toDto(teacher);

        // Assert
        assertNotNull(teacherDto);
        assertEquals(1L, teacherDto.getId());
        assertEquals("Jean", teacherDto.getFirstName());
        assertEquals("Nette", teacherDto.getLastName());
       
    }

    /*
    @Test
    void givenNullTeacherDto_whenToEntity_thenReturnsNull() {
        // Act
        Teacher teacher = teacherMapper.toEntity(null);

        // Assert
        assertNull(teacher);
    }

    @Test
    void givenNullTeacher_whenToDto_thenReturnsNull() {
        // Act
        TeacherDto teacherDto = teacherMapper.toDto(null);

        // Assert
        assertNull(teacherDto);
    }*/
}
