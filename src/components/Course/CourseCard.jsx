import React from 'react';

const CourseCard = ({ course, image }) => {
    return (
        <div className="card text-center shadow-sm">
            <img
                src={course.imageURL || image}
                alt={course.title}
                className="card-img-top rounded-circle mx-auto mt-3"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <div className="card-body">
                <h5 className="card-title text-primary">{course.title}</h5>
                <p className="card-text text-muted">{course.description}</p>
                <p className="card-text">
                    <strong>Instructor:</strong> {course.instructorName}
                </p>
            </div>
        </div>
    );
};

export default CourseCard;