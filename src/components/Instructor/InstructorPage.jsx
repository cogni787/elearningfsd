import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = 'http://localhost:20001/elearning/api/instructors';

const InstructorPage = ({ user }) => {
    const navigate = useNavigate();
    const { userName, userId, authToken, setCourseId } = useUserContext();
    const [showCourses, setShowCourses] = useState(false);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) {
            console.error('User ID is not defined.');
            return;
        }

        if (showCourses) {
            axios
                .get(`${BASE_URL}/${userId}/course`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                })
                .then(response => setCourses(response.data))
                .catch(() => setError('Failed to load courses. Please try again later.'));
        }
    }, [showCourses, userId, authToken]);

    const handleDeleteCourse = async (courseId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${userId}/courses/${courseId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (response.status === 200) {
                setCourses(courses.filter(course => course.courseId !== courseId));
                toast.success('Course deleted successfully!');
            } else {
                toast.error('Failed to delete course. Please try again.');
            }
        } catch {
            toast.error('An error occurred while deleting the course. Please try again.');
        }
    };

    const handleAddCourse = () => navigate('/instructor/add-course');
    const handleMyCoursesClick = () => setShowCourses(true);

    return (
        <div className="container mt-5">
            <div className="text-center mb-4">
                <h1 className="display-4">Welcome back, {userName}!</h1>
            </div>
            <div className="text-center mb-4">
                <button onClick={handleMyCoursesClick} className="btn btn-secondary btn-lg">My Courses</button>
            </div>
            {showCourses && (
                <>
                    <h2 className="text-center mb-4">All Courses</h2>
                    {error && <p className="text-danger text-center">{error}</p>}
                    <div className="row">
                        {courses.map((course) => (
                            <div key={course.courseId} className="col-md-4 mb-4">
                                <div className="card shadow-sm h-100">
                                    <div className="card-body">
                                        <h5 className="card-title text-center fw-bold">{course.title}</h5>
                                        {course.imageURL && (
                                            <img 
                                                src={course.imageURL} 
                                                alt={course.title} 
                                                className="card-img-top mb-3" 
                                                style={{ width: '100%', height: '200px', objectFit: 'cover' }} 
                                            />
                                        )}
                                        <p className="card-text">{course.description}</p>
                                        <p className="card-text"><strong>Instructor:</strong> {course.instructorName}</p>
                                        <a href={course.contentURL} target="_blank" rel="noopener noreferrer" className="btn btn-link">
                                            View Content
                                        </a>
                                        <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                                            <button 
                                                onClick={() => {
                                                    setCourseId(course.courseId);
                                                    navigate('/instructor/add-assessment');
                                                }} 
                                                className="btn btn-success btn-sm"
                                            >
                                                Create Assessment
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setCourseId(course.courseId);
                                                    navigate(`/instructor/updateCourse`);
                                                }} 
                                                className="btn btn-warning btn-sm"
                                            >
                                                Update
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteCourse(course.courseId)} 
                                                className="btn btn-danger btn-sm"
                                            >
                                                Delete
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setCourseId(course.courseId);
                                                    navigate(`/instructor/view-assessments`);
                                                }} 
                                                className="btn btn-info btn-sm"
                                            >
                                                View Assessments
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
            <div className="text-center mt-5">
                <h2>Instructor Tools</h2>
                <button onClick={handleAddCourse} className="btn btn-primary btn-lg mt-3">Create New Course</button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default InstructorPage;