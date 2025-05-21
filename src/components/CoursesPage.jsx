import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Correct import for useNavigate
import { getAllCourses } from '../services/courseService';
import { enrollInCourse, getEnrolledCourses } from '../services/enrollmentService'; // Import getEnrolledCourses
import { useUserContext } from '../context/UserContext'; // Import UserContext
import { Modal, Button } from 'react-bootstrap'; // Import Bootstrap Modal

const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);
    const { userId, authToken, userRole } = useUserContext(); // Get userId, authToken, and role from context
    const [enrolledCourses, setEnrolledCourses] = useState(new Set()); // Track enrolled courses
    const Navigate = useNavigate();
    const [modalMessage, setModalMessage] = useState(""); // State for modal message
    const [showModal, setShowModal] = useState(false); // State to control modal visibility

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getAllCourses(); 
                setCourses(data);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to fetch courses. Please try again later.');
            }
        };

        fetchCourses();
    }, []);
    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            if(!userId || !authToken) return; // Check if userId and authToken are available
                try {
                    const enrolled = await getEnrolledCourses(userId, authToken); // Fetch enrolled courses
                    setEnrolledCourses(new Set(enrolled.map((course) => course.courseId))); // Update enrolledCourses
                } catch (err) {
                    console.error('Error fetching enrolled courses:', err);
                }
            };
            fetchEnrolledCourses();
    }, [userId, authToken]); // Fetch enrolled courses when userId or authToken changes

    const handleEnroll = async (courseId) => {
        if (!userId || !authToken) {
            setModalMessage('You need to log in to enroll in a course.');
            setShowModal(true); // Show modal on error
           Navigate('/login'); // Redirect to the login page
            return;
        }
        try {
            await enrollInCourse(userId, courseId, authToken); // Call enrollInCourse from enrollmentService
            setEnrolledCourses((prev) => new Set(prev).add(courseId)); // Add courseId to enrolledCourses
            setModalMessage('Successfully enrolled in the course!');
            setShowModal(true); // Show modal on success
        } catch (err) {
            console.error('Error enrolling in course:', err);
            setModalMessage('Failed to enroll in the course. Please try again later.');
            setShowModal(true); // Show modal on error
        }
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">All Courses</h1>
            {error && <p className="alert alert-danger">{error}</p>}
            <div className="row">
                {courses.map((course) => (
                    <div key={course.courseId} className="col-md-4 mb-4">
                        <div className="card h-100 shadow-sm border-0 bg-light hover-shadow"> {/* Ensure hover-shadow is applied */}
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title text-primary">{course.title}</h5>

                                {course.imageURL && (
                                    
                                            <img 
                                                src={course.imageURL} 
                                                alt={course.title} 
                                                className="card-img-top mb-3" 
                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                                            />
                                        )}
                                <p className="card-text text-muted">{course.description}</p>
                                <p className="card-text"><strong>Instructor:</strong> {course.instructorName}</p>
                                <div className="mt-auto">
                                    {/* Show enroll button only if the user is not an instructor */}
                                    {userRole !== "ROLE_INSTRUCTOR" && (
                                        <button 
                                            onClick={() => handleEnroll(course.courseId)} 
                                            className="btn btn-success" 
                                            disabled={enrolledCourses.has(course.courseId)}
                                        >
                                            {enrolledCourses.has(course.courseId) ? 'Enrolled' : 'Enroll'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Notification</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CoursesPage;
