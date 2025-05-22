package com.cognizant.project.elearning.controllertest;

import com.cognizant.project.elearning.controller.CourseController;
import com.cognizant.project.elearning.dto.CourseResponseDTO;
import com.cognizant.project.elearning.service.CourseService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
 
import java.util.Arrays;
import java.util.List;
 
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
 
@ExtendWith(MockitoExtension.class)
public class CourseControllerTest {
 
    @Mock
    private CourseService courseService;
 
    @InjectMocks
    private CourseController courseController;
 
    private CourseResponseDTO course1;
    private CourseResponseDTO course2;
 
    @BeforeEach
    public void setUp() {
        course1 = new CourseResponseDTO();
        course1.setCourseId(1);
        course1.setTitle("Java Basics");
        course1.setDescription("Intro to Java");
        course1.setContentURL("http://example.com/java");
        course1.setInstructorId(101);
        course1.setInstructorName("John Doe");
        course1.setImageURL("http://example.com/image1.jpg");
 
        course2 = new CourseResponseDTO();
        course2.setCourseId(2);
        course2.setTitle("Spring Boot");
        course2.setDescription("Spring Boot in depth");
        course2.setContentURL("http://example.com/spring");
        course2.setInstructorId(102);
        course2.setInstructorName("Jane Smith");
        course2.setImageURL("http://example.com/image2.jpg");
    }
 
    @Test
    public void testViewAllCourse() {
        List<CourseResponseDTO> mockCourses = Arrays.asList(course1, course2);
        when(courseService.viewAllCourse()).thenReturn(mockCourses);
 
        ResponseEntity<List<CourseResponseDTO>> response = courseController.viewAllCourse();
 
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(2, response.getBody().size());
        assertEquals("Java Basics", response.getBody().get(0).getTitle());
    }
 
    @Test
    public void testViewSelectedCourse() {
        int courseId = 1;
        when(courseService.viewSelectedCourse(courseId)).thenReturn(course1);
 
        ResponseEntity<CourseResponseDTO> response = courseController.viewAllCourse(courseId);
 
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Java Basics", response.getBody().getTitle());
        assertEquals(courseId, response.getBody().getCourseId());
    }
}
 
 