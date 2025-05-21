import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../context/UserContext'; // Import useUserContext
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons CSS

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

function Header({ onLogout, showAuthButtons = true }) {
    const { userRole} = useUserContext(); // Get userRole from context
    const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
    const [showLogoutModal, setShowLogoutModal] = useState(false); // State for logout modal

    const handleLogoutClick = () => {
        if (onLogout) {
            onLogout();
        }
        setShowLogoutModal(true);
        setTimeout(()=>{ window.location.reload() },3000);
        // Show logout modal
    };

    const getMyCoursesPath = () => {
        if(userRole === 'ROLE_INSTRUCTOR') {
            return '/instructor'}
            else if(userRole==='ROLE_STUDENT'){
                return '/student'
            }
            else{
                return '/login'
            }
    };

    const toggleDropdown = () => {
        setShowDropdown((prevState) => !prevState); // Toggle dropdown state
    };

    const closeDropdown = () => {
        setShowDropdown(false); // Close dropdown
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!event.target.closest('.menu-button') && !event.target.closest('.dropdown-menu')) {
                closeDropdown(); // Close dropdown if clicked outside
            }
        };

        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <header className="bg-light p-3">
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container-fluid">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                <i className="bi bi-house-door-fill"></i> Home
                            </Link>
                        </li>
                        <li className="nav-item"><Link className="nav-link" to="/courses">Courses</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
                        <li className="nav-item"><Link className="nav-link" to={getMyCoursesPath()}>My Courses</Link></li>
                    </ul>
                    <div className="d-flex align-items-center position-relative"> {/* Added 'position-relative' */}
                        <button 
                            onClick={toggleDropdown} 
                            className="btn btn-outline-secondary me-2 menu-button"
                        >
                            ☰
                        </button>
                        {showDropdown && (
                            <div 
                                className="dropdown-menu show shadow rounded position-absolute" 
                                style={{ 
                                    minWidth: '200px', 
                                    backgroundColor: '#f8f9fa', 
                                    border: '1px solid #ddd', 
                                    top: '100%', // Position below the button
                                    left: '0',   // Align to the left of the button
                                    zIndex: 1050 // Ensure it appears above other elements
                                }}
                            >
                                <Link 
                                    className="dropdown-item text-dark fw-bold" 
                                    to={userRole === 'ROLE_INSTRUCTOR' ? '/instructor/profile' : '/student/profile'}
                                    style={{ padding: '10px 15px' }}
                                >
                                    My Profile
                                </Link>
                                {userRole === 'ROLE_STUDENT' && (
                                    <Link 
                                        className="dropdown-item text-dark fw-bold" 
                                        to="/progress"
                                        style={{ padding: '10px 15px' }}
                                    >
                                        My Progress
                                    </Link>
                                )}
                            </div>
                        )}
                        {showAuthButtons ? (
                            <div>
                                <Link to="/login"><button className="btn btn-primary me-2">Log in</button></Link>
                                <Link to="/register"><button className="btn btn-success">Sign up</button></Link>
                            </div>
                        ) : (
                            <button onClick={handleLogoutClick} className="btn btn-danger">Logout</button>
                        )}
                    </div>
                </div>
            </nav>
            {showLogoutModal && (
                <Modal
                    message="You have successfully logged out. Visit again! 😊"
                    onClose={() => setShowLogoutModal(false)} // Close modal
                />
            )}
        </header>
    );
}

export default Header;
