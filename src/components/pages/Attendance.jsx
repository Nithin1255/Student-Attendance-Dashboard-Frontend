import React, { useState, useEffect, useContext } from "react";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const Attendance = () => {
    const { user } = useContext(AuthContext);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [attendance, setAttendance] = useState({}); // Stores { studentId: "Present/Absent" }
    const [submitted, setSubmitted] = useState(false);

    // Fetch classes and subjects assigned to the logged-in teacher
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Assuming the teacher profile contains the classes and subjects they teach
                const profileRes = await api.get(`/teacher/profile`);
                setClasses(profileRes.data.classes || []);
                setSubjects(profileRes.data.subjects || []);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        if (user) {
            fetchData();
        }
    }, [user]);

    // Fetch students when a class and date are selected
    const fetchStudents = async () => {
        // If user tries to load students again, clear any previous 'submitted' state
        setSubmitted(false);
        setAttendance({});
        if (!selectedClass || !date || !selectedSubject) return;
        try {
            const response = await api.get(`/attendance?classId=${selectedClass}&subjectId=${selectedSubject}&date=${date}`);
            setStudents(response.data);
            console.log(response);

            // Initialize attendance state from fetched data
            const initialAttendance = response.data.reduce((acc, student) => {
                acc[student.studentId] = student.status || "Absent";
                return acc;
            }, {});
            setAttendance(initialAttendance);
        } catch (err) {
            console.error("Error fetching students:", err);
        }
    };

    // Handle attendance change for a single student
    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    // Submit the attendance sheet
    const handleSubmit = async (e) => {
        e.preventDefault();
        const records = Object.keys(attendance).map(studentId => ({ studentId, status: attendance[studentId] }));

        try {
            await api.post("/attendance/mark", {
                date,
                subjectId: selectedSubject,
                classId: selectedClass,
                session: 'Default',
                records,
            });
            alert("Attendance submitted successfully!");
            setSubmitted(true);
        } catch (err) {
            console.error("Error submitting attendance:", err);
            alert("Failed to submit attendance.");
        }
    };

    return (
        <div className="container mt-4" style={{ backgroundColor: '#f7f9fc', padding: 18, borderRadius: 10 }}>
            <h2 className="mb-4" style={{ color: '#0d6efd', fontSize: 26, fontWeight: 700 }}>Mark Attendance</h2>

            {/* Selection Form */}
            <div className="row g-3 align-items-end p-3 mb-4 rounded" style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 16px rgba(13,110,253,0.04)', padding: 18 }}>
                <div className="col-md-3">
                    <label htmlFor="classSelect" className="form-label">Class</label>
                    <select id="classSelect" className="form-select" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                        <option value="">Select Class</option>
                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="col-md-3">
                    <label htmlFor="subjectSelect" className="form-label">Subject</label>
                    <select id="subjectSelect" className="form-select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                        <option value="">Select Subject</option>
                        {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="col-md-3">
                    <label htmlFor="dateSelect" className="form-label">Date</label>
                    <input id="dateSelect" type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="col-md-3">
                    <button className="btn btn-primary btn-sm w-100" onClick={fetchStudents} style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd', padding: '10px 12px' }}>
                        Load Students
                    </button>
                </div>
            </div>

            {/* Attendance Sheet */}
            {students.length > 0 && !submitted && (
                <form onSubmit={handleSubmit}>
                    <table className="table align-middle table-hover shadow-sm" style={{ backgroundColor: '#ffffff' }}>
                        <thead style={{ backgroundColor: '#eaf4ff' }}>
                            <tr>
                                <th style={{ width: 120, color: '#0d6efd' }}>Roll No</th>
                                <th style={{ color: '#111827' }}>Student Name</th>
                                <th className="text-center" style={{ width: 160 }}>Attendance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student.studentId}>
                                    <td className="fw-semibold text-secondary" style={{ fontSize: 15 }}>{student.rollNo}</td>
                                    <td style={{ fontSize: 15 }}>{student.name}</td>
                                    <td className="text-center">
                                        <div className="form-check form-switch d-flex justify-content-center align-items-center" style={{ gap: 10 }}>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`attendance-${student.studentId}`}
                                                checked={attendance[student.studentId] === "Present"}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        student.studentId,
                                                        e.target.checked ? "Present" : "Absent"
                                                    )
                                                }
                                                style={{ width: 48, height: 26, cursor: 'pointer' }}
                                            />
                                            <span style={{ fontSize: 14, minWidth: 70 }} className={attendance[student.studentId] === 'Present' ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                                                {attendance[student.studentId] === 'Present' ? 'Present' : 'Absent'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Summary */}
                    <div className="d-flex justify-content-between align-items-center mt-3" style={{ maxWidth: 1000, margin: '12px auto' }}>
                        <div className="text-muted">Total: <strong>{students.length}</strong></div>
                        <div className="text-success">Present: <strong>{Object.values(attendance).filter(s => s === 'Present').length}</strong></div>
                        <div className="text-danger">Absent: <strong>{Object.values(attendance).filter(s => s === 'Absent').length}</strong></div>
                    </div>

                    <button type="submit" className="btn btn-success w-100 mt-3 shadow-sm">
                        Submit Attendance
                    </button>
                </form>
            )}

            {submitted && (
                <div className="alert alert-success mt-3" role="alert" style={{ maxWidth: 900, margin: '0 auto' }}>
                    Attendance submitted successfully. <button className="btn btn-link p-0 ms-2" onClick={() => setSubmitted(false)}>Edit again</button>
                </div>
            )}

        </div>
    );
};

export default Attendance; 