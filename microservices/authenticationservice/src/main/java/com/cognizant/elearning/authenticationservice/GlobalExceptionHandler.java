package com.cognizant.elearning.authenticationservice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class GlobalExceptionHandler{

	@ExceptionHandler(UserAlReadyExist.class)
	public ResponseEntity<String> handleUserAlreadExist(){
		return new ResponseEntity<>("user exists",HttpStatus.BAD_REQUEST);
	}
	
	
	
	
	@ExceptionHandler( UserDetailsMismatch.class)
	public ResponseEntity<String> handleUserNotExist(){
		return new ResponseEntity<>("user details wrong",HttpStatus.BAD_REQUEST);
	}
}