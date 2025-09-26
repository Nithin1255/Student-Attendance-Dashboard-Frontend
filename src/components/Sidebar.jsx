import React from 'react';
import { Link } from 'react-router-dom';
import { FaChalkboardTeacher, FaBookOpen, FaBook, FaUsers } from 'react-icons/fa';

const AdminDashboard = () => {

    const adminTasks = [
        {
            title: "Manage Teachers",
            description: "Add new teachers, update their profiles, and assign them to classes and subjects.",
            link: "/admin/dashboard/teachers",
            icon: <FaChalkboardTeacher size={28} className="text-primary" />
        },
        {
            title: "Manage Classes",
            description: "Create new classes, edit existing ones, and view the list of students in each class.",
            link: "/admin/dashboard/classes",
            icon: <FaBookOpen size={28} className="text-primary" />
        },
        {
            title: "Manage Subjects",
            description: "Define the subjects taught in your institution and see which teachers are assigned.",
            link: "/admin/dashboard/subjects",
            icon: <FaBook size={28} className="text-primary" />
        },
        {
            title: "Manage Students",
            description: "Add, edit, or remove students and assign them to their respective classes.",
            link: "/admin/dashboard/students",
            icon: <FaUsers size={28} className="text-primary" />
        }
    ];

    return (
        <div className="container-fluid mt-4">
            {/* Header */}
            <div className="p-5 mb-4 bg-light rounded-3 shadow-sm">
                <div className="container-fluid py-3">
                    <h1 className="display-5 fw-bold">Admin Control Center</h1>
                    <p className="col-md-10 fs-4 text-muted">
                        This is your central hub for managing the core components of the attendance system. Use the panels below to navigate to different management sections.
                    </p>
                </div>
            </div>

            {/* Admin Task Cards */}
            <div className="row row-cols-1 row-cols-lg-2 g-4">
                {adminTasks.map((task) => (
                    <div className="col" key={task.title}>
                        <div className="card h-100 shadow-sm border-0">
                            <div className="card-body p-4 d-flex flex-column">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="p-3 bg-primary bg-opacity-10 rounded-circle me-3">
                                        {task.icon}
                                    </div>
                                    <h4 className="card-title mb-0">{task.title}</h4>
                                </div>
                                <p className="card-text flex-grow-1 text-muted">{task.description}</p>
                                <Link to={task.link} className="btn btn-primary mt-auto align-self-start">
                                    Manage {task.title.split(' ')[1]}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;