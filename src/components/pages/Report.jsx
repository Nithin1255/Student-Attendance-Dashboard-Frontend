import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { FaFileDownload } from 'react-icons/fa';
import { Button } from 'react-bootstrap';

const Report = () => {
    const { user } = useContext(AuthContext);
    const [reportData, setReportData] = useState(null);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // State for filters
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [dateRange, setDateRange] = useState({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0],
    });

    // Fetch teacher's classes and subjects
    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;
            try {
                const res = await api.get('/teacher/profile');
                setClasses(res.data.classes || []);
                setSubjects(res.data.subjects || []);
                if (res.data.classes?.length > 0) {
                    setSelectedClass(res.data.classes[0]._id);
                }
            } catch (err) {
                setError("Error fetching profile data");
            }
        };
        fetchProfile();
    }, [user]);

    // Handler to generate the report
    const handleGenerateReport = async () => {
        if (!selectedClass) {
            setError("Please select a class.");
            return;
        }
        setLoading(true);
        setError("");
        setReportData(null);
        try {
            const res = await api.get('/attendance/master-report', {
                params: {
                    classId: selectedClass,
                    subjectId: selectedSubject,
                    from: dateRange.from,
                    to: dateRange.to,
                },
            });
            setReportData(res.data);
        } catch (err) {
            setError("Failed to generate report.");
        }
        setLoading(false);
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow-sm" style={{ border: "none", backgroundColor: "#f8f9fa" }}>
                <div className="card-header bg-white py-3">
                    <h4 className="mb-0 text-primary">Generate Attendance Report</h4>
                </div>
                <div className="card-body">
                    {/* Filters Section */}
                    <div className="row g-3 p-3 mb-4 bg-light rounded align-items-end">
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Class</label>
                            <select className="form-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                                <option value="">Select Class</option>
                                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Subject (Optional)</label>
                            <select className="form-select" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                                <option value="">All Subjects</option>
                                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label fw-bold">From</label>
                            <input type="date" className="form-control" value={dateRange.from} onChange={e => setDateRange(prev => ({ ...prev, from: e.target.value }))} />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label fw-bold">To</label>
                            <input type="date" className="form-control" value={dateRange.to} onChange={e => setDateRange(prev => ({ ...prev, to: e.target.value }))} />
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-primary w-100" onClick={handleGenerateReport} disabled={loading}>
                                {loading ? 'Generating...' : 'Generate Report'}
                            </button>
                        </div>
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}

                    {/* Report Display Section */}
                    {reportData && (
                        <div className="mt-4">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5>Master Attendance Sheet</h5>
                                    <Button variant="outline-secondary" size="sm" onClick={() => window.print()}>
                                        <FaFileDownload className="me-2" /> Download/Print
                                    </Button>
                                </div>
                                <div className="card-body">
                                    {/* Summary Cards */}
                                    <div className="row text-center mb-4">
                                        <div className="col-md-4">
                                            <div className="p-3 bg-light rounded">
                                                <h6 className="text-muted">Overall Attendance</h6>
                                                <h4 className="fw-bold">{reportData.summary.overallPercentage.toFixed(2)}%</h4>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="p-3 bg-light rounded">
                                                <h6 className="text-muted">Total Present</h6>
                                                <h4 className="fw-bold text-success">{reportData.summary.totalPresent}</h4>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="p-3 bg-light rounded">
                                                <h6 className="text-muted">Total Marked</h6>
                                                <h4 className="fw-bold">{reportData.summary.totalRecords}</h4>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detailed Table */}
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Roll No</th>
                                                    <th>Student Name</th>
                                                    <th>Present</th>
                                                    <th>Total Marked</th>
                                                    <th>Percentage</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {reportData.detailedReport.map(student => (
                                                    <tr key={student._id}>
                                                        <td>{student.rollNo}</td>
                                                        <td>{student.name}</td>
                                                        <td>{student.present}</td>
                                                        <td>{student.total}</td>
                                                        <td className="fw-bold">{student.percentage.toFixed(2)}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Report;