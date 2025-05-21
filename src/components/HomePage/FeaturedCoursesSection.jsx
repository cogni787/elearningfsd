import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CourseCard from '../CourseCard';
import { enrollInCourse } from '../../services/enrollmentService';
import { useUserContext } from '../../context/UserContext'; // Import useUserContext

//import { useUserContext } from '../../context/UserContext'; // Import useUserContext
//import { enrollInCourse } from '../../services/enrollmentService';
const API_BASE_URL = 'http://localhost:20003/api/courses';
function FeaturedCoursesSection() {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null); 
    const Navigate = useNavigate();
    const { userId, authToken, userRole } = useUserContext(); // Add userRole to destructuring

    useEffect(() => {
        const fetchCourses = async () => {

            try {
                const allCourses = await axios.get(`${API_BASE_URL}/`);
                console.log(allCourses.data);
                const coursesWithImages = allCourses.data.slice(0, 4).map((course, index) => ({
                    ...course,
                    image: getCourseImage(index), // Assign an image based on the index
                }));
                setCourses(coursesWithImages);
            } catch (err) {
                console.error('Error fetching courses:', err.response || err.message || err);
                setError('Failed to load featured courses. Please try again later.');
            }
        };

        fetchCourses();
    }, []);

    const handleEnroll = async (courseId) => {
        console.log('Enrolling in course:', courseId);
            if (!userId || !authToken) {
               Navigate('/login'); // Redirect to the login page
                return;
            }
            try {
                await enrollInCourse(userId, courseId, authToken); // Call enrollInCourse from enrollmentService
            } catch (err) {
                console.error('Error enrolling in course:', err);
            }
        };

    const getCourseImage = (index) => {
        const images = [
            'https://img.icons8.com/?size=100&id=pIJdjOoL6KfU&format=png&color=000000',
            'https://img.icons8.com/?size=100&id=GPfHz0SM85FX&format=png&color=000000',
            'https://img.icons8.com/?size=100&id=J6KcaRLsTgpZ&format=png&color=000000',
            'https://img.icons8.com/?size=100&id=dRqM1lGcJv6U&format=png&color=000000',
        ]; // Example image paths
        return images[index % images.length];
    };

    return (
        <section className="featured-courses">
            <h2>Featured Courses</h2>
            {error && <p className="text-danger">{error}</p>}
            <div className="courses-grid">
                {courses.map(course => (
                    <div key={course.courseId} className="course-card">
                        <CourseCard course={course} image={course.image} />
                        {userRole !== "ROLE_INSTRUCTOR" && ( // Show enroll button only if the user is not an instructor
                            <button
                                onClick={() => handleEnroll(course.courseId)}
                                className="btn btn-primary mt-2"
                            >
                                Enroll
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FeaturedCoursesSection;