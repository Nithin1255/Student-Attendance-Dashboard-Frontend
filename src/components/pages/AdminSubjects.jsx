import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminSubjects = () => {
    const [subjects, setSubjects] = useState([]);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [details, setDetails] = useState({}); // { subjectId: { teachers: [], classes: [] } }
    const [showDetails, setShowDetails] = useState(null);
    const [allTeachers, setAllTeachers] = useState([]);
    const [allClasses, setAllClasses] = useState([]);

    // Fetch all subjects
    const fetchSubjects = async () => {
        setLoading(true);
        setError("");
        try {
            // GET /api/subject/all-subjects (public/teacher route)
            const res = await api.get("/subject/all-subjects");
            setSubjects(res.data);
        } catch (err) {
            setError("Failed to fetch subjects");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSubjects();
        // Fetch all teachers and classes for subject details
        api.get('/teacher/all-teachers').then(res => setAllTeachers(res.data)).catch(() => { });
        api.get('/class/all-classes').then(res => setAllClasses(res.data)).catch(() => { });
    }, []);

    // Add or update subject
    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (editId) {
                await api.put(`/admin/subject/${editId}`, { name, code });
            } else {
                await api.post("/admin/subject", { name, code });
            }
            setName("");
            setCode("");
            setEditId(null);
            fetchSubjects();
        } catch (err) {
            setError("Failed to save subject");
        }
    };

    // Edit subject
    const handleEdit = (subject) => {
        setName(subject.name);
        setCode(subject.code);
        setEditId(subject._id);
    };

    // Delete subject
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this subject?")) return;
        try {
            await api.delete(`/admin/subject/${id}`);
            fetchSubjects();
        } catch (err) {
            setError("Failed to delete subject");
        }
    };

    // View details (teachers/classes) for a subject
    const handleViewDetails = (subjectId) => {
        if (showDetails === subjectId) {
            setShowDetails(null);
            return;
        }
        setShowDetails(subjectId);
        // Find teachers and classes for this subject from allTeachers
        if (!details[subjectId]) {
            // Teachers handling this subject
            const teachers = allTeachers.filter(t => t.subjectIds && t.subjectIds.some(s => s._id === subjectId || s === subjectId));
            // Classes handled by those teachers (unique)
            const classIdSet = new Set();
            teachers.forEach(t => (t.classIds || []).forEach(c => classIdSet.add(c._id || c)));
            const classes = allClasses.filter(c => classIdSet.has(c._id));
            setDetails(prev => ({ ...prev, [subjectId]: { teachers, classes } }));
        }
    };

    return (
        <div>
            <h3>Manage Subjects</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form className="row g-3 mb-4" onSubmit={handleAddOrUpdate}>
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Subject Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Subject Code"
                        value={code}
                        onChange={e => setCode(e.target.value)}
                        required
                    />
                </div>
                <div className="col-md-4">
                    <button type="submit" className="btn btn-primary">
                        {editId ? "Update" : "Add"} Subject
                    </button>
                    {editId && (
                        <button type="button" className="btn btn-secondary ms-2" onClick={() => {
                            setName(""); setCode(""); setEditId(null);
                        }}>Cancel</button>
                    )}
                </div>
            </form>
            {loading ? <div>Loading...</div> : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Code</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjects.map(subject => (
                            <React.Fragment key={subject._id}>
                                <tr>
                                    <td>{subject.name}</td>
                                    <td>{subject.code}</td>
                                    <td>
                                        <button className="btn btn-info btn-sm me-2" onClick={() => handleViewDetails(subject._id)}>
                                            {showDetails === subject._id ? "Hide" : "View"} Details
                                        </button>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(subject)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(subject._id)}>Delete</button>
                                    </td>
                                </tr>
                                {showDetails === subject._id && details[subject._id] && (
                                    <tr>
                                        <td colSpan={3}>
                                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', justifyContent: 'center' }}>
                                                {/* Teachers Card */}
                                                <div style={{ flex: 1, background: '#f8f9fa', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 20, minWidth: 250 }}>
                                                    <h6 className="mb-3" style={{ fontWeight: 600, color: '#333' }}>Teachers</h6>
                                                    {details[subject._id].teachers && details[subject._id].teachers.length > 0 ? (
                                                        <ul className="list-group mb-3">
                                                            {details[subject._id].teachers.map(t => (
                                                                <li key={t._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                                    <span>{t.name} <span className="text-muted">({t.email})</span></span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : <div className="text-muted mb-3">No teachers assigned</div>}
                                                </div>
                                                {/* Classes Card */}
                                                <div style={{ flex: 1, background: '#f8f9fa', borderRadius: 8, boxShadow: '0 2px 8px #0001', padding: 20, minWidth: 250 }}>
                                                    <h6 className="mb-3" style={{ fontWeight: 600, color: '#333' }}>Classes</h6>
                                                    {details[subject._id].classes && details[subject._id].classes.length > 0 ? (
                                                        <ul className="list-group mb-3">
                                                            {details[subject._id].classes.map(c => (
                                                                <li key={c._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                                    <span>{c.name}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : <div className="text-muted mb-3">No classes assigned</div>}
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

export default AdminSubjects;
