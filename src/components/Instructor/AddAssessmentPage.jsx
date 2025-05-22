import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddAssessmentPage = () => {
    const { userId, authToken, courseId } = useUserContext(); // Access courseId from context
    const navigate = useNavigate();

    // Move useState hooks to the top of the component
    const [formData, setFormData] = useState({
        question: '',
        maxScore: '',
    });
    const [message, setMessage] = useState('');

    const BASE_URL = 'http://localhost:20001/elearning/api/instructors';

    useEffect(() => {
        console.log('User ID:', userId);
        console.log('Auth Token:', authToken);
        console.log('Course ID from context after navigation:', courseId); // Debugging log
    }, [userId, authToken, courseId]);

    // Handle the case where courseId is undefined
    if (!courseId) {
        return navigate('/instructor'); // Redirect to instructor page if courseId is not available
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        console.log('Form Data:', formData); // Debugging log
        e.preventDefault();
        if (formData.maxScore < 0) {
            toast.error('Max Score cannot be negative. Please enter a value greater than or equal to 0.');
            return;
        }
        if (!userId || !authToken || !courseId) {
            setMessage('User ID, course ID, or authentication token is missing. Please log in again.');
            return;
        }
        try {
            const response = await axios.post(
                `${BASE_URL}/${userId}/courses/${courseId}/assessments`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            console.log('Response:', response);
            if (response.status === 201) {
                setMessage('Assessment created successfully!');
                setFormData({ type: '', maxScore: '' });
                setTimeout(() => navigate(`/instructor`), 2000);
            } else {
                setMessage('Failed to create assessment. Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Add Assessment</h2>
            <form onSubmit={handleSubmit} className="card p-4 shadow">
                <div className="mb-3">
                    <label className="form-label">Question:</label>
                    <input
                        type="text"
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Max Score:</label>
                    <input
                        type="number"
                        name="maxScore"
                        value={formData.maxScore}
                        onChange={handleChange}
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Add Assessment</button>
            </form>
            {message && <p className="mt-3 text-center">{message}</p>}
            <ToastContainer />
        </div>
    );
};

export default AddAssessmentPage;