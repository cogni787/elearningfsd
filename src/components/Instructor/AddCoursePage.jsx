import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext'; // Corrected import path
import axios from 'axios';

// Modal Component
const Modal = ({ message, onClose }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <button onClick={onClose} className="modal-close-button">Close</button>
            </div>
        </div>
    );
};

const AddCoursePage = () => {
    const { userId, authToken } = useUserContext(); // Access setCourseId from context

    useEffect(() => {
        console.log('User ID:', userId); // Log userId to the console
        console.log('Auth Token:', authToken); // Log authToken to the console
    }, [userId, authToken]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        contentURL: '',
    });
    const [message, setMessage] = useState(''); // State for success message
    const [errorMessage, setErrorMessage] = useState(null); // State for modal message
    const navigate = useNavigate();

    const BASE_URL = 'http://localhost:20001/elearning/api/instructors';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!formData.title || !formData.description || !formData.contentURL) {
            setErrorMessage('Please fill in all fields.');
            return;
        }
        if (!userId || !authToken) {
            setErrorMessage('User ID or authentication token is missing. Please log in again.');
            return;
        }
        try {
            const response = await axios.post(`${BASE_URL}/${userId}/courses`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`, // Use token from context
                },
            });

            if (response.status === 201) {
                setMessage('✅ Course created successfully!'); // Added tick emoji
                setFormData({ title: '', description: '', contentURL: '' });
                setTimeout(() => navigate('/instructor'), 2000); // Redirect to instructor page after success
            } else {
                setErrorMessage('Failed to create course. Please try again.');
            }
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8">
                        <div className="card shadow-lg">
                            <div className="card-header bg-primary text-white text-center">
                                <h2>Add Course</h2>
                            </div>
                            <div className="card-body">
                                <form >
                                    <div className="mb-3">
                                        <label className="form-label">Title:</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                           // Ensure required attribute
                                            className="form-control"
                                            placeholder="Enter course title"
                                            required 
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description:</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                           
                                             // Ensure required attribute
                                            className="form-control"
                                            placeholder="Enter course description"
                                            rows="4"
                                            required

                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Content URL:</label>
                                        <input
                                            type="url"
                                            name="contentURL"
                                            value={formData.contentURL}
                                            onChange={handleChange}
                                            // Ensure required attribute
                                            className="form-control"
                                            placeholder="Enter content URL"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100" onClick={handleSubmit}>Add Course</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {errorMessage && (
                <Modal
                    message={errorMessage}
                    onClose={() => setErrorMessage(null)} // Close modal
                />
            )}
            {message && (
                <Modal
                    message={message}
                    onClose={() => setMessage('')} // Close success modal
                />
            )}
        </>
    );
};

export default AddCoursePage;
