package com.cognizant.project.elearning.service;


import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.cognizant.project.elearning.dto.InstructorResponseDTO;
import com.cognizant.project.elearning.dto.RegisterRequestDTO;
import com.cognizant.project.elearning.dto.RegisterResponseDTO;
import com.cognizant.project.elearning.entity.Instructor;
import com.cognizant.project.elearning.entity.User;
import com.cognizant.project.elearning.exception.AllException.EmailAlreadyRegistered;
import com.cognizant.project.elearning.exception.AllException.InstructorDetailNotFound;
import com.cognizant.project.elearning.repository.InstructorRepository;
import com.cognizant.project.elearning.repository.UserRepository;

@Service
public class InstructorService {
	@Autowired
	ModelMapper modelMapper;
	@Autowired
	InstructorRepository instructorRepository ;
	@Autowired
	UserRepository userRepository;

	BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);

	public RegisterResponseDTO addInstructor(RegisterRequestDTO registerRequestDTO){
		Optional<User> user=userRepository.findByEmail(registerRequestDTO.getEmail());
		if(user.isPresent()) {
			throw new EmailAlreadyRegistered();
		}
		
		Instructor instructor= modelMapper.map(registerRequestDTO,Instructor.class);
		instructor.setPassword(encoder.encode(instructor.getPassword()));
		instructor=instructorRepository.save(instructor);
		return modelMapper.map(instructor, RegisterResponseDTO.class);
	}
	
	
	public String removeInstructor(int instructorId) {
	Optional<Instructor> container=instructorRepository.findById(instructorId);
	if(!container.isPresent()) {
		return "failed no one";
	}
	Instructor instructor=container.get();
	instructorRepository.delete(instructor);
	return "successful";
	
	}
	
	
	public InstructorResponseDTO viewInstructor(int instructorId) {
		Instructor instructor=instructorRepository.findById(instructorId).orElseThrow(
					()->new InstructorDetailNotFound("Instructor with Id "+instructorId+" not found."));
		return modelMapper.map(instructor,InstructorResponseDTO.class);
	}
	
}
