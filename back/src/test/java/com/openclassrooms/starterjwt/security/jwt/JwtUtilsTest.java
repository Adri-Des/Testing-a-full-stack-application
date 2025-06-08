package com.openclassrooms.starterjwt.security.jwt;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@SpringBootTest
class JwtUtilsIntegrationTest {

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    void givenAuthentication_whenGenerateJwtToken_thenTokenIsValid() {
        // Arrange
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("testuser@gmail.com")
                .password("password")
                .build();

        Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);

        // Act
        String token = jwtUtils.generateJwtToken(authentication);

        // Assert
        assertNotNull(token);
        assertTrue(jwtUtils.validateJwtToken(token));
        assertEquals("testuser@gmail.com", jwtUtils.getUserNameFromJwtToken(token));
    }

    @Test
    void givenInvalidToken_whenValidateJwtToken_thenReturnsFalse() {
        // Arrange
        String invalidToken = "invalid.jwt.token";

        // Act
        boolean isValid = jwtUtils.validateJwtToken(invalidToken);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void givenExpiredToken_whenValidateJwtToken_thenReturnsFalse() {
        // Arrange
        String expiredToken = Jwts.builder()
                .setSubject("testuser@gmail.com")
                .setIssuedAt(new Date(System.currentTimeMillis() - 10000)) 
                .setExpiration(new Date(System.currentTimeMillis() - 5000)) 
                .signWith(SignatureAlgorithm.HS512, "testSecretKey")
                .compact();

        // Act
        boolean isValid = jwtUtils.validateJwtToken(expiredToken);

        // Assert
        assertFalse(isValid);
    }

    @Test
    void givenTokenWithDifferentSecret_whenValidateJwtToken_thenReturnsFalse() {
        // Arrange
        String tokenWithDifferentSecret = Jwts.builder()
                .setSubject("testuser@gmail.com")
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 60000)) 
                .signWith(SignatureAlgorithm.HS512, "differentSecretKey")
                .compact();

        // Act
        boolean isValid = jwtUtils.validateJwtToken(tokenWithDifferentSecret);

        // Assert
        assertFalse(isValid);
    }
}
