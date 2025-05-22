import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../../context/UserContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ProfilePage = () => {
    const { userId, authToken } = useUserContext();
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');

    const BASE_URL = 'http://localhost:20001/elearning/api/instructors';

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId || !authToken) {
                setError('User ID or authentication token is missing. Please log in again.');
                return;
            }
            try {
                const response = await axios.get(`${BASE_URL}/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                });
                setProfileData(response.data);
            } catch (err) {
                setError('Failed to fetch profile data. Please try again.');
            }
        };

        fetchProfile();
    }, [userId, authToken]);

    if (error) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger text-center" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    if (!profileData) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3">Loading...</p>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-primary text-white text-center py-3">
                            <h3 className="mb-0">My Profile</h3>
                        </div>
                        <div className="card-body p-4">
                            <div className="text-center mb-4">
                                <div 
                                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto" 
                                    style={{ width: '120px', height: '120px', fontSize: '40px' }}
                                >
                                    <i className="bi bi-person-circle"></i>
                                </div>
                            </div>
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <th className="text-dark text-end" style={{ width: '40%' }}>Name:</th>
                                        <td className="text-muted bg-light p-2 rounded">{profileData.name}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-dark text-end">Email:</th>
                                        <td className="text-muted bg-light p-2 rounded">{profileData.email}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-dark text-end">Role:</th>
                                        <td className="text-muted bg-light p-2 rounded">{profileData.role}</td>
                                    </tr>
                                    <tr>
                                        <th className="text-dark text-end">Salary:</th>
                                        <td className="text-muted bg-light p-2 rounded">{profileData.salary}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="card-footer text-center bg-primary text-white py-2">
                            <small>Thank you for being a valued instructor!</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
