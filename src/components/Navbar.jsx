import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useContext(AuthContext); // ✅ get user from context
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/"); // Redirect to HomePage
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container-fluid">
                {/* Logo */}
                <NavLink className="navbar-brand fw-bold text-dark" to="/">
                    MyApp
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item">
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    "nav-link " + (isActive ? "text-white bg-primary" : "text-dark")
                                }
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                to="/about"
                                className={({ isActive }) =>
                                    "nav-link " + (isActive ? "text-white bg-primary" : "text-dark")
                                }
                            >
                                About
                            </NavLink>
                        </li>

                        {/* Right side: Login or User Info */}
                        {user ? (
                            <li className="nav-item dropdown ms-3">
                                <a
                                    className="nav-link dropdown-toggle d-flex align-items-center"
                                    href="#"
                                    id="userDropdown"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    {/* Profile picture */}
                                    {user.profilePic ? (
                                        <img
                                            src={user.profilePic}
                                            alt="profile"
                                            className="rounded-circle me-2"
                                            style={{ width: "35px", height: "35px", objectFit: "cover" }}
                                        />
                                    ) : (
                                        <div className="rounded-circle bg-secondary me-2" style={{ width: "35px", height: "35px" }}></div>
                                    )}
                                    <span>{user.name}</span>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                                    <li>
                                        <button className="dropdown-item" onClick={handleLogout}>
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <li className="nav-item ms-3">
                                <NavLink to="/login" className="btn btn-primary">
                                    Login
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
