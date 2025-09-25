import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminTeachers = () => {
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showDetails, setShowDetails] = useState(null);
    const [assignClassId, setAssignClassId] = useState("");
    const [assignSubjectId, setAssignSubjectId] = useState("");

    // Fetch all teachers, classes, subjects
    const fetchTeachers = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/teacher/all-teachers");
            setTeachers(res.data);
        } catch (err) {
            setError("Failed to fetch teachers");
        }
        setLoading(false);
    };
    const fetchClasses = async () => {
        try {
            const res = await api.get("/class/all-classes");
            setClasses(res.data);
        } catch (err) { }
    };
    const fetchSubjects = async () => {
        try {
            const res = await api.get("/subject/all-subjects");
            setSubjects(res.data);
        } catch (err) { }
    };

    useEffect(() => {
        fetchTeachers();
        fetchClasses();
        fetchSubjects();
    }, []);

    // Add or update teacher
    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (editId) {
                await api.put(`/admin/teacher/${editId}`, { name, email, password });
            } else {
                await api.post("/admin/teacher", { name, email, password });
            }
            setName(""); setEmail(""); setPassword(""); setEditId(null);
            fetchTeachers();
        } catch (err) {
            setError("Failed to save teacher");
        }
    };

    // Edit teacher
    const handleEdit = (teacher) => {
        setName(teacher.name);
        setEmail(teacher.email);
        setPassword("");
        setEditId(teacher._id);
    };

    // Delete teacher
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this teacher?")) return;
        try {
            await api.delete(`/admin/teacher/${id}`);
            fetchTeachers();
        } catch (err) {
            setError("Failed to delete teacher");
        }
    };

    // Assign class to teacher
    const handleAssignClass = async (teacherId) => {
        if (!assignClassId) return;
        try {
            await api.post("/admin/teacher/add-class", { teacherId, classId: assignClassId });
            setAssignClassId("");
            fetchTeachers();
        } catch (err) {
            setError("Failed to assign class");
        }
    };

    // Remove class from teacher
    const handleRemoveClass = async (teacherId, classId) => {
        try {
            await api.post("/admin/teacher/remove-class", { teacherId, classId });
            fetchTeachers();
        } catch (err) {
            setError("Failed to remove class");
        }
    };

    // Assign subject to teacher
    const handleAssignSubject = async (teacherId) => {
        if (!assignSubjectId) return;
        try {
            await api.post("/admin/teacher/add-subject", { teacherId, subjectId: assignSubjectId });
            setAssignSubjectId("");
            fetchTeachers();
        } catch (err) {
            setError("Failed to assign subject");
        }
    };

    // Remove subject from teacher
    const handleRemoveSubject = async (teacherId, subjectId) => {
        try {
            await api.post("/admin/teacher/remove-subject", { teacherId, subjectId });
            fetchTeachers();
        } catch (err) {
            setError("Failed to remove subject");
        }
    };

    return (
        <div>
            <h3>Manage Teachers</h3>
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
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required={!editId}
                    />
                </div>
                <div className="col-md-3">
                    <button type="submit" className="btn btn-primary">
                        {editId ? "Update" : "Add"} Teacher
                    </button>
                    {editId && (
                        <button type="button" className="btn btn-secondary ms-2" onClick={() => {
                            setName(""); setEmail(""); setPassword(""); setEditId(null);
                        }}>Cancel</button>
                    )}
                </div>
            </form>
            {loading ? <div>Loading...</div> : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map(teacher => (
                            <React.Fragment key={teacher._id}>
                                <tr>
                                    <td>{teacher.name}</td>
                                    <td>{teacher.email}</td>
                                    <td>
                                        <button className="btn btn-info btn-sm me-2" onClick={() => setShowDetails(showDetails === teacher._id ? null : teacher._id)}>
                                            {showDetails === teacher._id ? "Hide" : "View"} Details
                                        </button>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(teacher)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(teacher._id)}>Delete</button>
                                    </td>
                                </tr>
                                {showDetails === teacher._id && (
                                    <tr>
                                        <td colSpan={3}>
                                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', justifyContent: 'center' }}>
                                                {/* Classes Card */}
                                                <div style={{ flex: 1, background: '#f8f9fa', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 20, minWidth: 250 }}>
                                                    <h6 className="mb-3" style={{ fontWeight: 600, color: '#333' }}>Classes</h6>
                                                    {teacher.classIds && teacher.classIds.length > 0 ? (
                                                        <ul className="list-group mb-3">
                                                            {teacher.classIds.map(cls => (
                                                                <li key={cls._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                                    <span>{cls.name}</span>
                                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveClass(teacher._id, cls._id)}>Remove</button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : <div className="text-muted mb-3">No classes assigned</div>}
                                                    <div className="input-group">
                                                        <select className="form-select" value={assignClassId} onChange={e => setAssignClassId(e.target.value)}>
                                                            <option value="">Assign Class</option>
                                                            {classes.filter(c => !teacher.classIds.some(tc => tc._id === c._id)).map(cls => (
                                                                <option key={cls._id} value={cls._id}>{cls.name}</option>
                                                            ))}
                                                        </select>
                                                        <button className="btn btn-success" onClick={() => handleAssignClass(teacher._id)}>Assign</button>
                                                    </div>
                                                </div>
                                                {/* Subjects Card */}
                                                <div style={{ flex: 1, background: '#f8f9fa', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 20, minWidth: 250 }}>
                                                    <h6 className="mb-3" style={{ fontWeight: 600, color: '#333' }}>Subjects</h6>
                                                    {teacher.subjectIds && teacher.subjectIds.length > 0 ? (
                                                        <ul className="list-group mb-3">
                                                            {teacher.subjectIds.map(sub => (
                                                                <li key={sub._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                                    <span>{sub.name}</span>
                                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveSubject(teacher._id, sub._id)}>Remove</button>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : <div className="text-muted mb-3">No subjects assigned</div>}
                                                    <div className="input-group">
                                                        <select className="form-select" value={assignSubjectId} onChange={e => setAssignSubjectId(e.target.value)}>
                                                            <option value="">Assign Subject</option>
                                                            {subjects.filter(s => !teacher.subjectIds.some(ts => ts._id === s._id)).map(sub => (
                                                                <option key={sub._id} value={sub._id}>{sub.name}</option>
                                                            ))}
                                                        </select>
                                                        <button className="btn btn-success" onClick={() => handleAssignSubject(teacher._id)}>Assign</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminTeachers;
