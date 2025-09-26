import { FaClipboardList, FaChartBar, FaFileAlt, FaUserGraduate, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    // Common style for all sidebar links
    const linkStyle = {
        color: "#012970",
        background: "#F0F4FB",
        fontWeight: 500,
        transition: "background 0.2s, color 0.2s"
    };
    const linkClass = "d-flex align-items-center gap-2 text-decoration-none py-2 px-3 rounded mb-1 sidebar-link";

    // Logout handler
    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate("/");
    };

    return (
        <div
            className="d-flex flex-column shadow"
            style={{ width: "260px", height: "100vh", background: "#F0F4FB", position: "sticky", top: 0, overflow: "hidden" }}
        >
            <div className="flex-grow-1 px-3 py-2">
                {/* TRACK */}
                <div className="mb-4">
                    <p className="text-uppercase text-secondary fw-semibold small mb-2">Track</p>
                    <Link to="/attendance" className={linkClass} style={linkStyle} activeclassname="active">
                        <FaClipboardList size={18} />
                        <span>Mark Attendance</span>
                    </Link>
                </div>
                {/* ANALYZE */}
                <div className="mb-4">
                    <p className="text-uppercase text-secondary fw-semibold small mb-2">Analyze</p>
                    <Link to="/dashboard" className={linkClass} style={linkStyle} activeclassname="active">
                        <FaChartBar size={18} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/report" className={linkClass} style={linkStyle} activeclassname="active">
                        <FaFileAlt size={18} />
                        <span>Report</span>
                    </Link>
                </div>
                {/* MANAGE */}
                <div className="mb-4">
                    <p className="text-uppercase text-secondary fw-semibold small mb-2">Manage</p>
                    <Link to="/students" className={linkClass} style={linkStyle} activeclassname="active">
                        <FaUserGraduate size={18} />
                        <span>Students</span>
                    </Link>
                </div>
                {/* LOGOUT */}
                <div className="mt-auto">
                    <p className="text-uppercase text-secondary fw-semibold small mb-2">Account</p>
                    <a href="#" onClick={handleLogout} className={linkClass} style={{ ...linkStyle, color: "#DC3545" }}>
                        <FaSignOutAlt size={18} />
                        <span>Logout</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
