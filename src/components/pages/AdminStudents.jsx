import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminStudents = () => {
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);
    const [name, setName] = useState("");
    const [rollNo, setRollNo] = useState("");
    const [classId, setClassId] = useState("");
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch all students and classes

    // Use correct backend routes
    const fetchStudents = async () => {
        setLoading(true);
        setError("");
        try {
            // GET /api/student/ (all students)
            const res = await api.get("/student/");
            setStudents(res.data);
        } catch (err) {
            setError("Failed to fetch students");
        }
        setLoading(false);
    };
    const fetchClasses = async () => {
        try {
            // GET /api/class/all-classes
            const res = await api.get("/class/all-classes");
            setClasses(res.data);
        } catch (err) {
            // ignore
        }
    };

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, []);

    // Add or update student

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (editId) {
                // PUT /api/student/:id
                await api.put(`/student/${editId}`, { name, rollNo, classId });
            } else {
                // POST /api/student/
                await api.post("/student/", { name, rollNo, classId });
            }
            setName("");
            setRollNo("");
            setClassId("");
            setEditId(null);
            fetchStudents();
        } catch (err) {
            setError("Failed to save student");
        }
    };

    // Edit student
    const handleEdit = (student) => {
        setName(student.name);
        setRollNo(student.rollNo);
        setClassId(student.classId?._id || student.classId);
        setEditId(student._id);
    };

    // Delete student

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        try {
            // DELETE /api/student/:id
            await api.delete(`/student/${id}`);
            fetchStudents();
        } catch (err) {
            setError("Failed to delete student");
        }
    };

    // Group students by class name
    const studentsByClass = students.reduce((acc, student) => {
        const className = student.classId?.name || "Unknown";
        if (!acc[className]) acc[className] = [];
        acc[className].push(student);
        return acc;
    }, {});

    return (
        <div>
            <h3>Manage Students</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form className="row g-3 mb-4" onSubmit={handleAddOrUpdate}>
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Roll Number"
                        value={rollNo}
                        onChange={e => setRollNo(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={classId}
                        onChange={e => setClassId(e.target.value)}
                        required
                    >
                        <option value="">Select Class</option>
                        {classes.map(cls => (
                            <option key={cls._id} value={cls._id}>{cls.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <button type="submit" className="btn btn-primary">
                        {editId ? "Update" : "Add"} Student
                    </button>
                    {editId && (
                        <button type="button" className="btn btn-secondary ms-2" onClick={() => {
                            setName(""); setRollNo(""); setClassId(""); setEditId(null);
                        }}>Cancel</button>
                    )}
                </div>
            </form>
            {loading ? <div>Loading...</div> : (
                Object.keys(studentsByClass).length === 0 ? <div>No students found.</div> :
                    Object.entries(studentsByClass).map(([className, students]) => (
                        <div key={className} className="mb-4">
                            <h5>{className}</h5>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Roll Number</th>
                                        <th>Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student._id}>
                                            <td>{student.rollNo}</td>
                                            <td>{student.name}</td>
                                            <td>
                                                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(student)}>Edit</button>
                                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(student._id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
            )}
        </div>
    );
};

export default AdminStudents;
