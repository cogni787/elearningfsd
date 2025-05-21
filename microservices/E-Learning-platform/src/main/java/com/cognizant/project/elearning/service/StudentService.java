package com.cognizant.project.elearning.service;

import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.cognizant.project.elearning.dto.InstructorResponseDTO;
import com.cognizant.project.elearning.dto.RegisterRequestDTO;
import com.cognizant.project.elearning.dto.RegisterResponseDTO;
import com.cognizant.project.elearning.dto.StudentResponseDTO;
import com.cognizant.project.elearning.entity.Instructor;
import com.cognizant.project.elearning.entity.Student;
import com.cognizant.project.elearning.entity.User;
import com.cognizant.project.elearning.exception.AllException.EmailAlreadyRegistered;
import com.cognizant.project.elearning.exception.AllException.StudentDetailNotFound;
import com.cognizant.project.elearning.repository.StudentRepository;
import com.cognizant.project.elearning.repository.UserRepository;

@Service
public class StudentService {
    @Autowired
    ModelMapper modelMapper;

    @Autowired
    StudentRepository studentRepository;
    @Autowired
	UserRepository userRepository;
    
    BCryptPasswordEncoder encoder=new BCryptPasswordEncoder(12);
    public StudentResponseDTO viewStudent(int studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentDetailNotFound("Student with Id " + studentId + " not found."));
        return modelMapper.map(student, StudentResponseDTO.class);
    }

    public StudentResponseDTO updateStudentDetails(int studentId, String college, int age) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentDetailNotFound("Student with Id " + studentId + " not found."));
        student.setCollege(college);
        student.setAge(age);
        Student updatedStudent = studentRepository.save(student);
        return modelMapper.map(updatedStudent, StudentResponseDTO.class);
    }

	public RegisterResponseDTO  addStudent(RegisterRequestDTO registerRequestDTO) {
		Optional<User> user=userRepository.findByEmail(registerRequestDTO.getEmail());
		if(user.isPresent()) {
			throw new EmailAlreadyRegistered();
		}
		Student student= modelMapper.map(registerRequestDTO,Student.class);
		student.setPassword(encoder.encode(student.getPassword()));
		student=studentRepository.save(student);
		
		return modelMapper.map(student, RegisterResponseDTO.class);
	}


	
}
