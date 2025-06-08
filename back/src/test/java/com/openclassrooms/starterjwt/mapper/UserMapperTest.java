package com.openclassrooms.starterjwt.mapper;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

class UserMapperTest {

    private final UserMapper userMapper = Mappers.getMapper(UserMapper.class);
	/*@Autowired
	private UserMapper userMapper;*/

    @Test
    void givenDto_whenToEntity_thenMapsCorrectly() {
        // Arrange
        UserDto userDto = new UserDto();
        userDto.setId(1L);
        userDto.setEmail("jean.nette@gmail.com");
        userDto.setFirstName("Jean");
        userDto.setLastName("Nette");
        userDto.setPassword("password");

        // Act
        User user = userMapper.toEntity(userDto);

        // Assert
        assertNotNull(user);
        assertEquals(1L, user.getId());
        assertEquals("jean.nette@gmail.com", user.getEmail());
        assertEquals("Jean", user.getFirstName());
        assertEquals("Nette", user.getLastName());
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

    @Test
    void givenDtoList_whenToEntityList_thenMapsCorrectly() {
        UserDto dto1 = new UserDto();
        dto1.setId(1L);
        dto1.setEmail("jean.nette@gmail.com");
        dto1.setFirstName("Jean");
        dto1.setLastName("Nette");
        dto1.setPassword("password");

        UserDto dto2 = new UserDto();
        dto2.setId(2L);
        dto2.setEmail("jean.yves@gmail.com");
        dto2.setFirstName("Jean");
        dto2.setLastName("Yves");
        dto2.setPassword("password2");

        List<User> users = userMapper.toEntity(List.of(dto1, dto2));

        assertEquals(2, users.size());
        assertEquals("Jean", users.get(0).getFirstName());
        assertEquals("Jean", users.get(1).getFirstName());
    }
    
    @Test
    void givenUserList_whenToDtoList_thenMapsCorrectly() {
        User user1 = new User();
        user1.setId(1L);
        user1.setEmail("jean.nette@gmail.com");
        user1.setFirstName("Jean");
        user1.setLastName("Nette");
        user1.setPassword("password");

        User user2 = new User();
        user2.setId(2L);
        user2.setEmail("jean.yves@gmail.com");
        user2.setFirstName("Jean");
        user2.setLastName("Yves");
        user2.setPassword("password2");

        List<UserDto> dtos = userMapper.toDto(List.of(user1, user2));

        assertEquals(2, dtos.size());
        assertEquals("Jean", dtos.get(0).getFirstName());
        assertEquals("Jean", dtos.get(1).getFirstName());
    }
    
    @Test
    void givenNullDto_whenToEntity_thenReturnNull() {
        User user = userMapper.toEntity((UserDto)null);
        assertNull(user);
    }
    
    @Test
    void givenNullUser_whentoDto_thenReturnNull() {
        // Act
        UserDto userDto = userMapper.toDto((User)null);

        // Assert
        assertNull(userDto);
    }
    
    @Test
    void givenNullDtoList_whenToEntity_thenReturnNull() {
        // Act
        List<User> users = userMapper.toEntity((List<UserDto>)null);

        // Assert
        assertNull(users);
    }
    
    @Test
    void givenNullUserList_whentoDto_thenReturnNull() {
        // Act
        List<UserDto> dtos = userMapper.toDto((List<User>)null);

        // Assert
        assertNull(dtos);
    }
}
