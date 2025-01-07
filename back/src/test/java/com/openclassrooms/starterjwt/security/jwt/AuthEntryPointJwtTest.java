package com.openclassrooms.starterjwt.security.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;

import static org.mockito.Mockito.*;

public class AuthEntryPointJwtTest {

    private AuthEntryPointJwt authEntryPointJwt;
    private HttpServletRequest mockRequest;
    private HttpServletResponse mockResponse;

    @BeforeEach
    public void setUp() {
        authEntryPointJwt = new AuthEntryPointJwt();
        mockRequest = mock(HttpServletRequest.class);
        mockResponse = mock(HttpServletResponse.class);
    }

    @Test
    public void givenUnauthorizedRequest_whenCommence_thenCorrectResponse() throws Exception {
        // Mock request and response
        when(mockRequest.getServletPath()).thenReturn("/api/session");

        // Prepare a mock ServletOutputStream
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        ServletOutputStream servletOutputStream = new ServletOutputStream() {
            @Override
            public void write(int b) {
                byteArrayOutputStream.write(b);
            }

            @Override
            public boolean isReady() {
                return true; // Always ready to write
            }

            @Override
            public void setWriteListener(javax.servlet.WriteListener writeListener) {
                // No-op for this test
            }
        };
        when(mockResponse.getOutputStream()).thenReturn(servletOutputStream);

        // Mock the writer to avoid errors
        PrintWriter writer = new PrintWriter(byteArrayOutputStream);
        when(mockResponse.getWriter()).thenReturn(writer);

        // Call commence
        authEntryPointJwt.commence(mockRequest, mockResponse, new org.springframework.security.core.AuthenticationException("Unauthorized") {});

        // Flush the writer
        writer.flush();

        // Get response content
        String responseContent = byteArrayOutputStream.toString();

        // Verify response properties
        verify(mockResponse).setContentType("application/json");
        verify(mockResponse).setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // Assertions
        assert responseContent.contains("\"status\":401");
        assert responseContent.contains("\"error\":\"Unauthorized\"");
        assert responseContent.contains("\"message\":\"Unauthorized\"");
        assert responseContent.contains("\"path\":\"/api/session\"");
    }

}

