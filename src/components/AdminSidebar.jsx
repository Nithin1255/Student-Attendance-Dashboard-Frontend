import { FaChalkboardTeacher, FaBook, FaUsers, FaBookOpen, FaSignOutAlt, FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const AdminSidebar = () => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
    const linkStyle = {
        color: "#012970",
        background: "#F0F4FB",
        fontWeight: 500,
        transition: "background 0.2s, color 0.2s"
    };
    const linkClass = "d-flex align-items-center gap-2 text-decoration-none py-2 px-3 rounded mb-1 sidebar-link";
    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate("/");
    };
    return (
        <div className="d-flex flex-column shadow" style={{ width: "260px", height: "100vh", background: "#F0F4FB", position: "sticky", top: 0, overflow: "hidden" }}>
            <div className="flex-grow-1 px-3 py-2">
                <div className="mb-4">
                    <p className="text-uppercase text-secondary fw-semibold small mb-2">Admin</p>
                    <Link to="/admin/dashboard" className={linkClass} style={linkStyle}><FaHome size={18} /><span>Dashboard Home</span></Link>
                </div>
                <div className="mb-4">
                    <p className="text-uppercase text-secondary fw-semibold small mb-2">Manage</p>
                    <Link to="/admin/dashboard/teachers" className={linkClass} style={linkStyle}><FaChalkboardTeacher size={18} /><span>Teachers</span></Link>
                    <Link to="/admin/dashboard/classes" className={linkClass} style={linkStyle}><FaBookOpen size={18} /><span>Classes</span></Link>
                    <Link to="/admin/dashboard/subjects" className={linkClass} style={linkStyle}><FaBook size={18} /><span>Subjects</span></Link>
                    <Link to="/admin/dashboard/students" className={linkClass} style={linkStyle}><FaUsers size={18} /><span>Students</span></Link>
                </div>
                <div className="mt-auto">
                    <p className="text-uppercase text-secondary fw-semibold small mb-2">Account</p>
                    <a href="#" onClick={handleLogout} className={linkClass} style={{ ...linkStyle, color: "#DC3545" }}><FaSignOutAlt size={18} /><span>Logout</span></a>
                </div>
            </div>
        </div>
    );
};
export default AdminSidebar;
