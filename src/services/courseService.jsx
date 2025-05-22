import axios from 'axios';

const API_BASE_URL = 'http://localhost:20001/elearning/api/courses'; // Ensure this matches your backend URL

export const getAllCourses = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/`); // Calls the backend endpoint
        return response.data; // Returns the list of courses
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
};

export const getCourseById = async (courseId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/course/${courseId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        throw error;
    }
};
