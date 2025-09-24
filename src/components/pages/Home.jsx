import React, { useContext } from "react";
import { Link } from "react-router-dom"; // 1. Import Link for navigation
import { AuthContext } from "../../context/AuthContext"; // 2. Import your AuthContext
import landingImage from "../../assets/landingImage.jpg";

function Home() {
    // 3. Get the user object from the context
    const { user } = useContext(AuthContext);

    return (
        <div className="landing-page">
            <div className="container mt-5">
                <div className="row align-items-center">
                    {/* Text section */}
                    <div className="col-md-6 text-center text-md-start">
                        <h1 className="display-4 fw-bold mb-3">
                            Welcome to Student Attendance Dashboard
                        </h1>
                        <p className="lead mb-4">
                            Easily track attendance, manage classes, and generate reports in
                            real-time. Designed for teachers, optimized for productivity.
                        </p>

                        {/* 4. Use the Link component with a conditional path */}
                        <Link
                            to={user ? "/dashboard" : "/login"}
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