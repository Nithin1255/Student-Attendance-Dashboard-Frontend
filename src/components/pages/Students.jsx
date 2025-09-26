import React, { useState, useEffect, useContext } from "react";
import { Modal, Button } from "react-bootstrap";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const Students = () => {
    const { user } = useContext(AuthContext);
    const [classes, setClasses] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // State for CRUD Modal
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentStudent, setCurrentStudent] = useState({ name: '', rollNo: '', classId: '' });

    // State for Report Modal
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportData, setReportData] = useState(null);
    const [selectedStudentName, setSelectedStudentName] = useState("");

    // Fetch teacher's classes first
    useEffect(() => {
        const fetchTeacherData = async () => {
            if (!user) return;
            try {
                const res = await api.get("/teacher/profile");
                setClasses(res.data.classes || []);
                // Pre-select the first class to improve UX
                if (res.data.classes && res.data.classes.length > 0) {
                    setSelectedClass(res.data.classes[0]._id);
                }
            } catch (err) {
                setError("Could not load your classes.");
            }
        };
        fetchTeacherData();
    }, [user]);

    // Fetch students when a class is selected
    useEffect(() => {
        const fetchStudentsForClass = async () => {
            if (!selectedClass) {
                setStudents([]);
                return;
            }
            setLoading(true);
            setError("");
            try {
                const res = await api.get(`/student/class/${selectedClass}`);
                setStudents(res.data);
            } catch (err) {
                setError("Failed to load students for this class.");
            }
            setLoading(false);
        };
        fetchStudentsForClass();
    }, [selectedClass]);

    // --- CRUD Handlers ---
    const handleShowModal = (student = null) => {
        if (student) {
            setIsEditing(true);
            setCurrentStudent({ ...student, classId: student.classId._id });
        } else {
            setIsEditing(false);
            setCurrentStudent({ name: '', rollNo: '', classId: selectedClass });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSaveStudent = async () => {
        const url = isEditing ? `/student/${currentStudent._id}` : '/student';
        const method = isEditing ? 'put' : 'post';
        try {
            await api[method](url, currentStudent);
            handleCloseModal();
            // Refresh student list
            const res = await api.get(`/student/class/${selectedClass}`);
            setStudents(res.data);
        } catch (err) {
            setError("Failed to save student.");
        }
    };

    const handleDeleteStudent = async (studentId) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            try {
                await api.delete(`/student/${studentId}`);
                setStudents(students.filter(s => s._id !== studentId));
            } catch (err) {
                setError("Failed to delete student.");
            }
        }
    };

    // --- Report Handlers ---
    const handleShowReport = async (student) => {
        setSelectedStudentName(student.name);
        try {
            const res = await api.get(`/attendance/student/${student._id}/report`);
            const overallData = [
                { name: 'Present', value: res.data.overall },
                { name: 'Absent', value: 100 - res.data.overall }
            ];
            setReportData({ overall: overallData, bySubject: res.data.bySubject });
            setShowReportModal(true);
        } catch (err) {
            setError("Could not fetch attendance report.");
        }
    };

    const handleCloseReportModal = () => setShowReportModal(false);

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Manage Students</h4>
                    <div className="d-flex align-items-center">
                        {classes.length > 0 && (
                            <select className="form-select me-3" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                                {classes.map((cls) => (<option key={cls._id} value={cls._id}>{cls.name}</option>))}
                            </select>
                        )}
                        <Button variant="primary" onClick={() => handleShowModal()}>Add Student</Button>
                    </div>
                </div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {loading ? <p className="text-center">Loading students...</p> : (
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Roll Number</th>
                                    <th>Name</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length > 0 ? students.map((student) => (
                                    <tr key={student._id}>
                                        <td>{student.rollNo}</td>
                                        <td>{student.name}</td>
                                        <td className="text-end">
                                            <Button variant="outline-info" size="sm" className="me-2" onClick={() => handleShowReport(student)}>View Report</Button>
                                            <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowModal(student)}>Edit</Button>
                                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteStudent(student._id)}>Delete</Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" className="text-center text-muted">No students found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Add/Edit Student Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton><Modal.Title>{isEditing ? 'Edit' : 'Add'} Student</Modal.Title></Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" value={currentStudent.name} onChange={e => setCurrentStudent({ ...currentStudent, name: e.target.value })} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Roll Number</label>
                        <input type="text" className="form-control" value={currentStudent.rollNo} onChange={e => setCurrentStudent({ ...currentStudent, rollNo: e.target.value })} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="primary" onClick={handleSaveStudent}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* Attendance Report Modal */}
            <Modal show={showReportModal} onHide={handleCloseReportModal} size="lg">
                <Modal.Header closeButton><Modal.Title>Attendance Report for {selectedStudentName}</Modal.Title></Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-md-6 text-center">
                            <h5>Overall Attendance</h5>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={reportData?.overall} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                        <Cell key="cell-0" fill="#00C49F" />
                                        <Cell key="cell-1" fill="#FF8042" />
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="col-md-6 text-center">
                            <h5>Subject-wise Attendance</h5>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie data={reportData?.bySubject} dataKey="percentage" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={(entry) => `${entry.name} (${entry.percentage.toFixed(0)}%)`}>
                                        {reportData?.bySubject.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Students;