import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const AdminClasses = () => {
    const [classes, setClasses] = useState([]);
    const [name, setName] = useState("");
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchClasses = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await api.get("/class/all-classes");
            setClasses(res.data);
        } catch (err) {
            setError("Failed to fetch classes");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        setError("");
        try {
            if (editId) {
                await api.put(`/class/${editId}`, { name });
            } else {
                await api.post("/class/addClass", { name });
            }
            setName("");
            setEditId(null);
            fetchClasses();
        } catch (err) {
            setError("Failed to save class");
        }
    };

    const handleEdit = (cls) => {
        setName(cls.name);
        setEditId(cls._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this class?")) return;
        try {
            await api.delete(`/class/${id}`);
            fetchClasses();
        } catch (err) {
            setError("Failed to delete class");
        }
    };

    return (
        <div>
            <h3>Manage Classes</h3>
            <form className="row g-3 mb-4" onSubmit={handleAddOrUpdate}>
                <div className="col-auto">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Class Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-success">
                        {editId ? "Update" : "Add"} Class
                    </button>
                    {editId && (
                        <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditId(null); setName(""); }}>
                            Cancel
                        </button>
                    )}
                </div>
            </form>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? <div>Loading...</div> : (
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map(cls => (
                            <tr key={cls._id}>
                                <td>{cls.name}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(cls)}>Edit</button>
                                    <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(cls._id)}>Delete</button>
                                    <button className="btn btn-info btn-sm" onClick={() => navigate(`/admin/dashboard/classes/${cls._id}/students`)}>View Students</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminClasses;
