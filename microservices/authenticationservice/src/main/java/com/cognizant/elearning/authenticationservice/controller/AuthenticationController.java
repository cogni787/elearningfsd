package com.cognizant.elearning.authenticationservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cognizant.elearning.authenticationservice.dto.LoginRequestDTO;
import com.cognizant.elearning.authenticationservice.dto.LoginResponseDTO;
import com.cognizant.elearning.authenticationservice.dto.RegisterRequestDTO;
import com.cognizant.elearning.authenticationservice.dto.RegisterResponseDTO;
import com.cognizant.elearning.authenticationservice.service.AuthenticationService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {


    @Autowired
    AuthenticationService authenticationService;

    // for user registration
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@Valid @RequestBody RegisterRequestDTO registerRequestDTO) {
        ResponseEntity<RegisterResponseDTO> response = new ResponseEntity<>(authenticationService.register(registerRequestDTO), HttpStatus.OK);
        return response;
    }
    // for user login
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO loginRequestDTO) {
        ResponseEntity<LoginResponseDTO> response = new ResponseEntity<>(authenticationService.login(loginRequestDTO), HttpStatus.OK);
        return response;
    }
}
