package com.cognizant.project.elearning.servicetest;

 
import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.*;
 
import java.util.Optional;
 
import org.junit.jupiter.api.BeforeEach;

import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;

import org.mockito.Mock;

import org.mockito.junit.jupiter.MockitoExtension;

import org.modelmapper.ModelMapper;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
 
import com.cognizant.project.elearning.dto.InstructorResponseDTO;

import com.cognizant.project.elearning.dto.RegisterRequestDTO;

import com.cognizant.project.elearning.dto.RegisterResponseDTO;

import com.cognizant.project.elearning.entity.Instructor;

import com.cognizant.project.elearning.entity.User;

import com.cognizant.project.elearning.exception.AllException.EmailAlreadyRegistered;

import com.cognizant.project.elearning.exception.AllException.InstructorDetailNotFound;

import com.cognizant.project.elearning.repository.InstructorRepository;

import com.cognizant.project.elearning.repository.UserRepository;

import com.cognizant.project.elearning.service.InstructorService;
 
@ExtendWith(MockitoExtension.class)

public class InstructorServiceTest {
 
    @Mock private ModelMapper modelMapper;

    @Mock private InstructorRepository instructorRepository;

    @Mock private UserRepository userRepository;
 
    @InjectMocks private InstructorService instructorService;
 
    private RegisterRequestDTO registerRequestDTO;

    private RegisterResponseDTO registerResponseDTO;

    private Instructor instructor;

    private InstructorResponseDTO instructorDTO;
 
    @BeforeEach

    public void setUp() {

        registerRequestDTO = new RegisterRequestDTO();

        registerRequestDTO.setName("Jane Doe");

        registerRequestDTO.setEmail("jane.doe@example.com");

        registerRequestDTO.setPassword("password123");
 
        registerResponseDTO = new RegisterResponseDTO();

        registerResponseDTO.setName("Jane Doe");

        registerResponseDTO.setEmail("jane.doe@example.com");
 
        instructor = new Instructor();

        instructor.setUserId(1);

        instructor.setName("Jane Doe");

        instructor.setEmail("jane.doe@example.com");

        instructor.setPassword("encodedPassword");
 
        instructorDTO = new InstructorResponseDTO();

        instructorDTO.setUserId(1);

        instructorDTO.setName("Jane Doe");

        instructorDTO.setEmail("jane.doe@example.com");

    }
 
    @Test

    public void testAddInstructor_Success() {

        when(userRepository.findByEmail(registerRequestDTO.getEmail())).thenReturn(Optional.empty());

        when(modelMapper.map(registerRequestDTO, Instructor.class)).thenReturn(instructor);

        when(instructorRepository.save(any(Instructor.class))).thenReturn(instructor);

        when(modelMapper.map(instructor, RegisterResponseDTO.class)).thenReturn(registerResponseDTO);
 
        RegisterResponseDTO result = instructorService.addInstructor(registerRequestDTO);
 
        assertEquals(registerResponseDTO, result);

    }
 
    @Test

    public void testAddInstructor_EmailAlreadyRegistered() {

        when(userRepository.findByEmail(registerRequestDTO.getEmail())).thenReturn(Optional.of(new User()));
 
        assertThrows(EmailAlreadyRegistered.class, () -> {

            instructorService.addInstructor(registerRequestDTO);

        });

    }
 
    @Test

    public void testRemoveInstructor_Success() {

        when(instructorRepository.findById(1)).thenReturn(Optional.of(instructor));
 
        String result = instructorService.removeInstructor(1);
 
        verify(instructorRepository).delete(instructor);

        assertEquals("successful", result);

    }
 
    @Test

    public void testRemoveInstructor_Failed() {

        when(instructorRepository.findById(1)).thenReturn(Optional.empty());
 
        String result = instructorService.removeInstructor(1);
 
        assertEquals("failed no one", result);

    }
 
    @Test

    public void testViewInstructor_Success() {

        when(instructorRepository.findById(1)).thenReturn(Optional.of(instructor));

        when(modelMapper.map(instructor, InstructorResponseDTO.class)).thenReturn(instructorDTO);
 
        InstructorResponseDTO result = instructorService.viewInstructor(1);
 
        assertEquals(instructorDTO, result);

    }
 
    @Test

    public void testViewInstructor_NotFound() {

        when(instructorRepository.findById(1)).thenReturn(Optional.empty());
 
        assertThrows(InstructorDetailNotFound.class, () -> {

            instructorService.viewInstructor(1);

        });

    }

}

 