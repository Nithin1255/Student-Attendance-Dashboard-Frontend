import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminDashboardLayout = () => {
    return (
        <div className="d-flex">
            <AdminSidebar />
            <div className="flex-grow-1 p-4" style={{ overflowY: "auto", height: "100vh" }}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboardLayout;
