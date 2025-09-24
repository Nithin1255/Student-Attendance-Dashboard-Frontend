import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
    return (
        <div className="d-flex" style={{ height: "100vh", overflow: "hidden" }}>
            {/* Sidebar */}
            <Sidebar />

            {/* Content Area (scrollable) */}
            <div className="flex-grow-1 p-4" style={{ overflowY: "auto", height: "100vh" }}>
                <Outlet /> {/* Renders the child route's component */}
            </div>
        </div>
    );
}

export default DashboardLayout;
