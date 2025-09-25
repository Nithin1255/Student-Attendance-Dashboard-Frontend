import React, { useState, useEffect, useContext } from 'react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [reportData, setReportData] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // State for filters
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [dateRange, setDateRange] = useState({
        from: new Date(new Date().setDate(1)).toISOString().split('T')[0], // First day of current month
        to: new Date().toISOString().split('T')[0], // Today
    });

    // Fetch teacher's classes and subjects for the dropdowns
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/teacher/profile');
                setClasses(res.data.classes || []);
                setSubjects(res.data.subjects || []);
                // Set default selections if possible
                if (res.data.classes?.length > 0) setSelectedClass(res.data.classes[0]._id);
                if (res.data.subjects?.length > 0) setSelectedSubject(res.data.subjects[0]._id);
            } catch (err) {
                console.error("Error fetching profile data:", err);
            }
        };
        if (user) {
            fetchProfile();
        }
    }, [user]);

    // Function to fetch the daily percentage report data based on filters
    const fetchReport = async () => {
        if (!selectedClass || !dateRange.from || !dateRange.to) {
            return;
        }
        try {
            const res = await api.get(`/attendance/report/daily`, {
                params: {
                    classId: selectedClass,
                    subjectId: selectedSubject,
                    from: dateRange.from,
                    to: dateRange.to,
                }
            });
            // res.data = [{ date: 'YYYY-MM-DD', day: number, presentCount, classStrength, percentage }, ...]
            const mapped = res.data.map(item => ({
                date: item.date,
                day: item.day,
                percentage: Number(item.percentage.toFixed(2)),
                presentCount: item.presentCount,
                classStrength: item.classStrength,
            }));
            setReportData(mapped);
        } catch (err) {
            console.error("Error fetching daily report data:", err);
            setReportData([]);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Attendance Dashboard</h2>

            {/* Filters Section */}
            <div className="row g-3 p-3 mb-4 bg-light rounded align-items-end">
                <div className="col-md-3">
                    <label className="form-label">Class</label>
                    <select className="form-select" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                        {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Subject</label>
                    <select className="form-select" value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
                        {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="col-md-2">
                    <label className="form-label">From</label>
                    <input type="date" className="form-control" value={dateRange.from} onChange={e => setDateRange(prev => ({ ...prev, from: e.target.value }))} />
                </div>
                <div className="col-md-2">
                    <label className="form-label">To</label>
                    <input type="date" className="form-control" value={dateRange.to} onChange={e => setDateRange(prev => ({ ...prev, to: e.target.value }))} />
                </div>
                <div className="col-md-2">
                    <button className="btn btn-primary w-100" onClick={fetchReport}>
                        Generate Report
                    </button>
                </div>
            </div>

            {/* Chart Section */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <h5 className="card-title">Attendance Trend (Percentage)</h5>
                    {reportData.length === 0 ? (
                        <p className="text-center text-muted mt-4">No data available for the selected filters. Please generate a report.</p>
                    ) : (
                        <>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <span className="badge bg-light text-dark me-2">Class: {classes.find(c => c._id === selectedClass)?.name || '-'}</span>
                                    <span className="badge bg-light text-dark">Subject: {subjects.find(s => s._id === selectedSubject)?.name || '-'}</span>
                                </div>
                                <div>
                                    <small className="text-muted">Average</small>
                                    <div style={{ fontSize: 20, fontWeight: 700 }}>{
                                        (reportData.reduce((sum, r) => sum + (r.percentage || 0), 0) / reportData.length).toFixed(2)
                                    }%</div>
                                </div>
                            </div>

                            <div style={{ width: '100%', height: 420 }}>
                                <ResponsiveContainer>
                                    <AreaChart data={reportData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="colorPerc" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.6} />
                                                <stop offset="95%" stopColor="#0d6efd" stopOpacity={0.06} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" label={{ value: 'Day of month', position: 'insideBottom', offset: -5 }} />
                                        <YAxis domain={[0, 100]} unit="%" />
                                        <Tooltip
                                            formatter={(value, name) => [`${value}%`, 'Attendance %']}
                                            labelFormatter={(label) => `Day ${label} - ${reportData.find(d => d.day === label)?.date || ''}`}
                                            contentStyle={{ borderRadius: 8 }}
                                        />
                                        <Legend />
                                        <Area type="monotone" dataKey="percentage" stroke="#0d6efd" strokeWidth={2} fill="url(#colorPerc)" dot={{ r: 3 }} activeDot={{ r: 6 }} name="Attendance %" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;