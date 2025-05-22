import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/StaticPage/Header';
import HeroSection from './components/HomePage/HeroSection';
import FeaturedCoursesSection from './components/HomePage/FeaturedCoursesSection';
import AboutUsSection from './components/HomePage/AboutUsSection';
import AuthPage from './components/Authentication/AuthPage';
import StudentPage from './components/Student/StudentPage';
import InstructorPage from './components/Instructor/InstructorPage';
import './App.css';
import Footer from './components/StaticPage/Footer';
import CoursesPage from './components/Course/CoursesPage';
import AddCoursePage from './components/Instructor/AddCoursePage';
import AddAssessmentPage from './components/Instructor/AddAssessmentPage';
import { UserProvider } from './context/UserContext';
import UpdateCoursePage from './components/Instructor/UpdateCoursePage.jsx';
import ProfilePage from './components/Instructor/ProfilePage.jsx';
import StudentProfile from './components/Student/StudentProfile';

import AssessmentList from './components/Student/AssessmentList'; // Import AssessmentList
import ViewScore from './components/Student/ViewScore'; // Import ViewScore

import InstructorQuestionnaire from './components/Instructor/InstructorQuestionnaire';
import ViewAssessments from './components/Instructor/ViewAssessments';
import ViewSubmissions from './components/Instructor/ViewSubmissions';
import Evaluate from './components/Instructor/Evaluate';
import SearchCourse from './components/SearchCourse/SearchCourse';
import MyProgress from './components/Student/MyProgress.jsx';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        const storedAuthToken = localStorage.getItem('authToken');
        const storedUserRole = localStorage.getItem('userRole');
        const storedUserName = localStorage.getItem('userName');

        if (storedUserId && storedAuthToken) {
            setIsLoggedIn(true);
            setUser({
                userId: storedUserId,
                authToken: storedAuthToken,
                role: storedUserRole,
                name: storedUserName,
            });
        }
        setLoading(false);
    }, []);

    const handleLogin = (userData) => {
        console.log('User logged in:', userData); // Debugging log
        setIsLoggedIn(true);
        setUser(userData);
        navigate(userData.role === 'ROLE_STUDENT' ? '/courses' : '/instructor');
    };

    const handleRegister = () => {
        navigate('/login');
    };

    const handleLogout = () => {
        console.log('User logged out'); // Debugging log
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');


        navigate('/');
        // window.location.reload(); // Refresh the page
    };
    if (loading) {
        return <div>Loading...</div>; // Show a loading indicator while checking login status
    }

    return (
        <UserProvider>
            <div className="app">
                <Header onLogout={handleLogout} showAuthButtons={!isLoggedIn} />
                <Routes>

                    
                    <Route path="/student/course/assessments" element={isLoggedIn && user?.role === 'ROLE_STUDENT' ? <AssessmentList/>: <Navigate to="/login"/>} /> 
                    <Route
                        path="/"
                        element={
                            <>
                                <HeroSection />
                                <FeaturedCoursesSection />
                               < AboutUsSection/>
                                <Footer />
                            </>
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            <AuthPage
                                showLogin={true}
                                showRegister={false}
                                onLoginSuccess={handleLogin}
                                onRegisterSuccess={handleRegister}
                            />
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <AuthPage
                                showLogin={false}
                                showRegister={true}
                                onLoginSuccess={handleLogin}
                                onRegisterSuccess={handleRegister}
                            />
                        }
                    />
                    <Route
                        path="/student"
                        element={
                            isLoggedIn && user?.role === 'ROLE_STUDENT' ? (
                                <StudentPage user={user} />
                            ) : (
                                <Navigate to="/login"/>
                            )
                        }
                    />
                    <Route
                        path="/instructor"
                        element={
                            isLoggedIn && user?.role === 'ROLE_INSTRUCTOR' ? (
                                <InstructorPage user={user} />
                            ) : (
                                <Navigate to="/login"/>
                            )
                        }
                    />
                    <Route path="/courses" element={<CoursesPage />} />
                    <Route
                        path="/instructor/add-course"
                        element={
                            isLoggedIn && user?.role === 'ROLE_INSTRUCTOR' ? (
                                <AddCoursePage user={user} />
                            ) : (
                                <Navigate to="/login"/>
                            )
                        }
                    />
                    <Route
                        path="/instructor/add-assessment"
                        element={
                            isLoggedIn && user?.role === 'ROLE_INSTRUCTOR' ? (
                                <AddAssessmentPage />
                            ) : (
                                <Navigate to="/login"/>
                            )
                        }
                    />
                    <Route
                        path="/instructor/updateCourse"
                        element={
                            isLoggedIn && user?.role === 'ROLE_INSTRUCTOR' ? (
                                <UpdateCoursePage />
                            ) : (
                                <Navigate to="/login"/>
                            )
                        }
                    />
                    <Route
                        path="/instructor/profile"
                        element={
                            isLoggedIn && user?.role === 'ROLE_INSTRUCTOR' ? (
                                <ProfilePage />
                            ) : (
                                <Navigate to="/login"/>
                            )
                        }
                    />
                    <Route
                        path="/student/profile"
                        element={
                            isLoggedIn && user?.role === 'ROLE_STUDENT' ? (
                                <StudentProfile />
                            ) : (
                                <Navigate to="/login"/>
                            )
                        }
                    />
                    <Route
                        path="/instructor/questionnaire"
                        element={<InstructorQuestionnaire />}
                    />
                    <Route path="/instructor/view-assessments" element={<ViewAssessments />} />
                    <Route path="/instructor/view-submissions/:assessmentId" element={<ViewSubmissions />} />
                    <Route path="/evaluate/:submissionId" element={<Evaluate />} />
                    <Route path="/view-score/:submissionId" element={<ViewScore />} />
                    <Route
                        path="/about"
                        element={<AboutUsSection />}
                    />
                    <Route path="/course/:courseId" element={<SearchCourse />} />
                    <Route
                        path="/progress"
                        element={
                            isLoggedIn && user?.role === 'ROLE_STUDENT' ? (
                                <MyProgress />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route path="/*" element={<PageNotFound/>} />
                </Routes>
            </div>
        </UserProvider>
    );
}

function PageNotFound(){
    return (
        <div>
            <h1>Page Not Found</h1>
        </div>
    );
}
function RootApp() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default RootApp;
