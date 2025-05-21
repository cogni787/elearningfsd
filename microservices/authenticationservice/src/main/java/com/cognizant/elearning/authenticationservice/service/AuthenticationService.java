package com.cognizant.elearning.authenticationservice.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.cognizant.elearning.authenticationservice.ElearningClient;
import com.cognizant.elearning.authenticationservice.UserAlReadyExist;
import com.cognizant.elearning.authenticationservice.UserDetailsMismatch;
import com.cognizant.elearning.authenticationservice.dto.LoginRequestDTO;
import com.cognizant.elearning.authenticationservice.dto.LoginResponseDTO;
import com.cognizant.elearning.authenticationservice.dto.RegisterRequestDTO;
import com.cognizant.elearning.authenticationservice.dto.RegisterResponseDTO;
import com.cognizant.elearning.authenticationservice.dto.User;
import com.cognizant.elearning.authenticationservice.security.JWTService;

@Service
public class AuthenticationService {
	@Autowired
	ModelMapper modelMapper;
	
	@Autowired
	ElearningClient elearningClient;

	@Autowired
	private JWTService jwtService;

	@Autowired
	AuthenticationManager authenticationManager ;

	BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);
	public RegisterResponseDTO register(RegisterRequestDTO registerRequestDTO) {
		
		try {
		
		if(registerRequestDTO.getRole().name().equals("ROLE_STUDENT")) {
			return elearningClient.addStudent(registerRequestDTO).getBody();
		}
		else if(registerRequestDTO.getRole().name().equals("ROLE_INSTRUCTOR")) {
			return elearningClient.addInstructor(registerRequestDTO).getBody();
		}}
		catch(Exception e) {
			throw new UserAlReadyExist();
		}
		return null;
		
		
	
	}
	public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
		try {
		LoginResponseDTO loginResponseDTO=null;
		RegisterResponseDTO reg=elearningClient.getUserDetail(loginRequestDTO).getBody();
		loginResponseDTO=modelMapper.map(reg, LoginResponseDTO.class);
		User user=modelMapper.map(reg, User.class);


		authenticationManager.authenticate(
	new UsernamePasswordAuthenticationToken(loginRequestDTO.getEmail(),loginRequestDTO.getPassword()));

		loginResponseDTO.setToken( jwtService.generateToken(user));
				
				
				return loginResponseDTO;
		}
		catch(Exception e) {
		throw new UserDetailsMismatch();
		}


	}

}
