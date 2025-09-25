import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }
    // If user is not logged in → redirect to login
    if (!user) {
        return <Navigate to="/" replace />;
    }
    // If user is logged in → render children routes
    return <Outlet />;
};

export default PrivateRoute;
