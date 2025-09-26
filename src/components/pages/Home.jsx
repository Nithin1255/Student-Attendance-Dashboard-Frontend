import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import landingImage from "../../assets/landingImage.jpg";

function Home() {
    const { user } = useContext(AuthContext);

    // ✅ FIX: Determine the correct dashboard path based on the user's role
    const getDashboardPath = () => {
        if (!user) {
            return "/login"; // If no user, go to login
        }
        if (user.role === "admin") {
            return "/admin/dashboard"; // If user is an admin
        }
        return "/dashboard"; // Otherwise, user is a teacher
    };

    return (
        <div className="landing-page">
            <div className="container mt-5">
                <div className="row align-items-center">
                    {/* Text section */}
                    <div className="col-md-6 text-center text-md-start">
                        <h1 className="display-4 fw-bold mb-3">
                            Welcome to ClassRoll
                        </h1>
                        <p className="lead mb-4">
                            Easily track attendance, manage classes, and generate reports in
                            real-time. Designed for teachers, optimized for productivity.
                        </p>

                        {/* Use the new function to set the path */}
                        <Link
                            to={getDashboardPath()}
                            className="btn btn-primary btn-lg"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Image section */}
                    <div className="col-md-6 text-center mt-4 mt-md-0">
                        <img
                            src={landingImage}
                            alt="Dashboard Illustration"
                            className="img-fluid"
                            style={{ maxHeight: "400px" }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;