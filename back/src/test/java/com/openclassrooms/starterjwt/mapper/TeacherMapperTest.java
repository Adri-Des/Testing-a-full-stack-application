package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

@ExtendWith(MockitoExtension.class)
class TeacherMapperTest {

    private final TeacherMapper teacherMapper = Mappers.getMapper(TeacherMapper.class);

    @Test
    void givenTeacherDto_whenToEntity_thenMapsCorrectly() {
        // Arrange
        TeacherDto teacherDto = new TeacherDto();
        teacherDto.setId(1L);
        teacherDto.setFirstName("Jean");
        teacherDto.setLastName("Nette");
       

        // Act
        Teacher teacher = teacherMapper.toEntity(teacherDto);

        // Assert
        assertNotNull(teacher);
        assertEquals(1L, teacher.getId());
        assertEquals("Jean", teacher.getFirstName());
        assertEquals("Nette", teacher.getLastName());
       
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

    @Test
    void givenTeacherDtoList_whenToEntityList_thenMapsCorrectly() {
        TeacherDto dto1 = new TeacherDto();
        dto1.setId(1L);
        dto1.setFirstName("Jean");
        dto1.setLastName("Nette");
       

        TeacherDto dto2 = new TeacherDto();
        dto2.setId(2L);
        dto2.setFirstName("Jean");
        dto2.setLastName("Yves");
        

        List<Teacher> teachers = teacherMapper.toEntity(List.of(dto1, dto2));

        assertEquals(2, teachers.size());
        assertEquals("Jean", teachers.get(0).getFirstName());
        assertEquals("Jean", teachers.get(1).getFirstName());
    }

    
    @Test
    void givenTeacherList_whenToDtoList_thenMapsCorrectly() {
        Teacher teacher1 = new Teacher();
        teacher1.setId(1L);
        teacher1.setFirstName("Jean");
        teacher1.setLastName("Nette");
        

        Teacher teacher2 = new Teacher();
        teacher2.setId(2L);
        teacher2.setFirstName("Jean");
        teacher2.setLastName("Yves");

        List<TeacherDto> dtos = teacherMapper.toDto(List.of(teacher1, teacher2));

        assertEquals(2, dtos.size());
        assertEquals("Jean", dtos.get(0).getFirstName());
        assertEquals("Jean", dtos.get(1).getFirstName());
    }
    
    @Test
    void givenNullDto_whenToEntity_thenReturnNull() {
        Teacher teacher = teacherMapper.toEntity((TeacherDto)null);
        assertNull(teacher);
    }
    
    @Test
    void givenNullTeacher_whentoDto_thenReturnNull() {
        // Act
        TeacherDto teacherDto = teacherMapper.toDto((Teacher)null);

        // Assert
        assertNull(teacherDto);
    }
    
    @Test
    void givenNullDtoList_whenToEntity_thenReturnNull() {
        // Act
        List<Teacher> teachers = teacherMapper.toEntity((List<TeacherDto>)null);

        // Assert
        assertNull(teachers);
    }
    
    @Test
    void givenNullTeacherList_whentoDto_thenReturnNull() {
        // Act
        List<TeacherDto> dtos = teacherMapper.toDto((List<Teacher>)null);

        // Assert
        assertNull(dtos);
    }
}
