import axios from 'axios';

const API_BASE_URL = 'http://localhost:20001/elearning/api/students';

export const enrollInCourse = async (userId, courseId, authToken) => {
    const response = await axios.post(
        `${API_BASE_URL}/${userId}/enroll/${courseId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${authToken}`, // Include authToken in headers
            },
        }
    );
    return response.data;
};
export const getEnrolledCourses = async (userId, authToken) => {
    const response = await axios.get(`${API_BASE_URL}/${userId}/enrolled-courses`, {
        headers: {
            Authorization: `Bearer ${authToken}`, // Include authToken in headers
        },
    });
    return response.data;
};
