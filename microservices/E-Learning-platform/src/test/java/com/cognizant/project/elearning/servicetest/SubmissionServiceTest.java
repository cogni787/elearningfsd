package com.cognizant.project.elearning.servicetest;

 
import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.ArgumentMatchers.any;

import static org.mockito.Mockito.*;
 
import java.util.Optional;

import java.util.Collections;

import java.util.List;
 
import org.junit.jupiter.api.BeforeEach;

import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;

import org.mockito.Mock;

import org.mockito.junit.jupiter.MockitoExtension;

import org.modelmapper.ModelMapper;
 
import com.cognizant.project.elearning.dto.SubmissionRequestDTO;

import com.cognizant.project.elearning.dto.SubmissionResponseDTO;

import com.cognizant.project.elearning.entity.Assessment;

import com.cognizant.project.elearning.entity.Student;

import com.cognizant.project.elearning.entity.Submission;

import com.cognizant.project.elearning.exception.AllException.AssessmentNotFound;

import com.cognizant.project.elearning.exception.AllException.StudentDetailNotFound;

import com.cognizant.project.elearning.repository.AssessmentRepository;

import com.cognizant.project.elearning.repository.StudentRepository;

import com.cognizant.project.elearning.repository.SubmissionRepository;

import com.cognizant.project.elearning.service.SubmissionService;
 
@ExtendWith(MockitoExtension.class)

public class SubmissionServiceTest {
 
    @Mock private ModelMapper modelMapper;

    @Mock private SubmissionRepository submissionRepository;

    @Mock private AssessmentRepository assessmentRepository;

    @Mock private StudentRepository studentRepository;
 
    @InjectMocks private SubmissionService submissionService;
 
    private Student student;

    private Assessment assessment;

    private Submission submission;

    private SubmissionRequestDTO submissionRequestDTO;

    private SubmissionResponseDTO submissionResponseDTO;
 
    @BeforeEach

    public void setUp() {

        student = new Student();

        student.setUserId(1);

        student.setName("John Doe");
 
        assessment = new Assessment();

        assessment.setAssessmentId(1);

        assessment.setQuestion("What is Java?");

        assessment.setMaxScore(100);
 
        submission = new Submission();

        submission.setSubmissionId(1);

        submission.setStudentId(student);

        submission.setAssessmentId(assessment);

        submission.setAnswer("Java is a programming language.");
 
        submissionRequestDTO = new SubmissionRequestDTO();

        submissionRequestDTO.setAnswer("Java is a programming language.");
 
        submissionResponseDTO = new SubmissionResponseDTO();

        submissionResponseDTO.setSubmissionId(1);

        submissionResponseDTO.setAssessmentId(1);

        submissionResponseDTO.setQuestion("What is Java?");

        submissionResponseDTO.setAnswer("Java is a programming language.");

        submissionResponseDTO.setMaxScore(100);

        submissionResponseDTO.setStudentId(1);

        submissionResponseDTO.setTitle("Java Programming");

    }

    @Test

    public void testSubmitAssessment_StudentNotFound() {

        when(studentRepository.findById(1)).thenReturn(Optional.empty());
 
        assertThrows(StudentDetailNotFound.class, () -> {

            submissionService.submitAssessment(1, 1, submissionRequestDTO);

        });

    }
 
    @Test

    public void testSubmitAssessment_AssessmentNotFound() {

        when(studentRepository.findById(1)).thenReturn(Optional.of(student));

        when(assessmentRepository.findById(1)).thenReturn(Optional.empty());
 
        assertThrows(AssessmentNotFound.class, () -> {

            submissionService.submitAssessment(1, 1, submissionRequestDTO);

        });

    }

 
    @Test

    public void testViewScore_Success() {

        when(submissionRepository.findById(1)).thenReturn(Optional.of(submission));

        when(assessmentRepository.findById(1)).thenReturn(Optional.of(assessment));

        when(modelMapper.map(submission, SubmissionResponseDTO.class)).thenReturn(submissionResponseDTO);
 
        SubmissionResponseDTO result = submissionService.viewScore(1);
 
        assertEquals(100, result.getMaxScore());

        assertEquals("What is Java?", result.getQuestion());

    }
 
    @Test

    public void testViewStudentSubmissions_Success() {

        when(submissionRepository.findByAssessmentIdAssessmentIdAndStudentIdUserId(1, 1))

            .thenReturn(Collections.singletonList(submission));

        when(modelMapper.map(submission, SubmissionResponseDTO.class)).thenReturn(submissionResponseDTO);
 
        List<SubmissionResponseDTO> result = submissionService.viewStudentSubmissions(1, 1);
 
        assertEquals(1, result.size());

        assertEquals(1, result.get(0).getSubmissionId());

    }

}

 