import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useParams } from "react-router-dom";

const AdminClassStudents = () => {
    const { classId } = useParams();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchStudents() {
            setLoading(true);
            setError("");
            try {
                const res = await api.get(`/admin/class/${classId}/students`);
                setStudents(res.data);
            } catch (err) {
                setError("Failed to fetch students");
            }
            setLoading(false);
        }
        fetchStudents();
    }, [classId]);

    return (
        <div>
            <h4>Students in this Class</h4>
            {loading && <div>Loading...</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <table className="table table-bordered mt-3">
                <thead>
                    <tr>
                        <th>RollNumber</th>
                        <th>Name</th>
                        {/* Add more columns as needed */}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student._id}>
                            <td>{student.rollNo}</td>
                            <td>{student.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminClassStudents;
