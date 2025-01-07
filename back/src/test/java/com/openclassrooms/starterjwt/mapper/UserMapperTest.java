package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.junit.jupiter.api.Assertions.*;

class UserMapperTest {

    private final UserMapper userMapper = Mappers.getMapper(UserMapper.class);

    @Test
    void givenUserDto_whenToEntity_thenMapsCorrectly() {
        // Arrange
        UserDto userDto = new UserDto();
        userDto.setId(1L);
        userDto.setEmail("user.test@gmail.com");
        userDto.setFirstName("User");
        userDto.setLastName("Test");
        userDto.setPassword("password");

        // Act
        User user = userMapper.toEntity(userDto);

        // Assert
        assertNotNull(user);
        assertEquals(1L, user.getId());
        assertEquals("user.test@gmail.com", user.getEmail());
        assertEquals("User", user.getFirstName());
        assertEquals("Test", user.getLastName());
        assertEquals("password", user.getPassword());
    }

    @Test
    void givenUser_whenToDto_thenMapsCorrectly() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setEmail("jean.nette@gmail.com");
        user.setFirstName("Jean");
        user.setLastName("Nette");
        user.setPassword("password");

        // Act
        UserDto userDto = userMapper.toDto(user);

        // Assert
        assertNotNull(userDto);
        assertEquals(1L, userDto.getId());
        assertEquals("jean.nette@gmail.com", userDto.getEmail());
        assertEquals("Jean", userDto.getFirstName());
        assertEquals("Nette", userDto.getLastName());
        assertEquals("password", userDto.getPassword());
    }

    
}
