package com.openclassrooms.starterjwt.security;

import com.fasterxml.jackson.databind.ObjectMapper;
//import com.openclassrooms.starterjwt.controllers.AuthController;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
//@WebMvcTest(AuthController.class)
@Import(WebSecurityConfig.class)
public class WebSecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

  /* @Test
   public void givenNoAuthentication_whenAccessPublicEndpoint_thenOk() throws Exception {
        mockMvc.perform(post("/api/auth/login")
        .contentType(MediaType.APPLICATION_JSON)
        .content("{\"email\":\"yoga@studio.com\",\"password\":\"test!1234\"}"))
                .andExpect(status().isOk());
   }*/

    @Test
    public void givenNoAuthentication_whenAccessProtectedEndpoint_thenUnauthorized() throws Exception {
        mockMvc.perform(get("/api/session"))
                .andExpect(status().isUnauthorized());
    }

   /* @Test
    //@WithMockUser(username = "testuser", user = {"USER"})
    public void givenAuthentication_whenAccessProtectedEndpoint_thenOk() throws Exception {
        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk());
    }*/

    @Test
    public void givenInvalidJwt_whenAccessProtectedEndpoint_thenUnauthorized() throws Exception {
        mockMvc.perform(get("/api/session")
                .header("Authorization", "Bearer invalid_token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    public void givenValidJwt_whenAccessProtectedEndpoint_thenOk() throws Exception {
        String validJwt = " eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ5b2dhQHN0dWRpby5jb20iLCJpYXQiOjE3MzYxNDgxODAsImV4cCI6MTczNjIzNDU4MH0.fx8eV5QsfZAYmhi8N3gjqAZVHyFcJu9PfrFl3E1SmUg-I7EY8cTGO-imrPF2hYmQB5aOJmUCodrMwr--bTYEQQ";

        mockMvc.perform(get("/api/session")
                .header("Authorization", "Bearer " + validJwt))
                .andExpect(status().isOk());
    }
}
