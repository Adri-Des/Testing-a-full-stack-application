package com.openclassrooms.starterjwt.security.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

public class UserDetailsImplTest {

    private UserDetailsImpl userDetails;

    @BeforeEach
    public void setUp() {
        userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("testUser")
                .firstName("Test")
                .lastName("User")
                .password("password")
                .admin(true)
                .build();
    }

    @Test
    public void testGetters() {
        assertEquals(1L, userDetails.getId());
        assertEquals("testUser", userDetails.getUsername());
        assertEquals("Test", userDetails.getFirstName());
        assertEquals("User", userDetails.getLastName());
        assertEquals("password", userDetails.getPassword());
        assertTrue(userDetails.getAdmin());
    }

    @Test
    public void testIsAccountNonExpired() {
        assertTrue(userDetails.isAccountNonExpired());
    }

    @Test
    public void testIsAccountNonLocked() {
        assertTrue(userDetails.isAccountNonLocked());
    }

    @Test
    public void testIsCredentialsNonExpired() {
        assertTrue(userDetails.isCredentialsNonExpired());
    }

    @Test
    public void testIsEnabled() {
        assertTrue(userDetails.isEnabled());
    }

    @Test
    public void testGetAuthorities() {
        Collection<?> authorities = userDetails.getAuthorities();
        assertNotNull(authorities);
        assertTrue(authorities.isEmpty());
    }

    @Test
    public void testEquals_SameId() {
        UserDetailsImpl anotherUser = UserDetailsImpl.builder()
                .id(1L)
                .username("otherUser")
                .build();
        assertEquals(userDetails, anotherUser);
    }

    @Test
    public void testEquals_DifferentId() {
        UserDetailsImpl anotherUser = UserDetailsImpl.builder()
                .id(2L)
                .username("otherUser")
                .build();
        assertNotEquals(userDetails, anotherUser);
    }

    @Test
    public void testEquals_Null() {
        assertNotEquals(userDetails, null);
    }

    @Test
    public void testEquals_DifferentClass() {
        assertNotEquals(userDetails, "notAUserDetailsImpl");
    }
}
