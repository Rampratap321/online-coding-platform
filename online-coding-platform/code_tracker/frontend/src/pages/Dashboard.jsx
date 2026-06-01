import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserSubmissions } from '../services/submissionService';
import { Code2, Target, Trophy, Clock } from 'lucide-react';
import './Dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (user && user.id) {
                try {
                    const subRes = await getUserSubmissions(user.id);
                    setSubmissions(subRes.data);
                } catch (err) {
                    console.error("Failed to load dashboard data", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchUserData();
    }, [user]);

    if (loading) return <div className="loading-state">Loading your dashboard...</div>;

    const acceptedSubmissions = submissions.filter(s => s.status === 'ACCEPTED');
    const uniqueProblemsSolved = new Set(acceptedSubmissions.map(s => s.problem.id)).size;
    const totalSubmissions = submissions.length;
    const acceptanceRate = totalSubmissions > 0
        ? Math.round((acceptedSubmissions.length / totalSubmissions) * 100)
        : 0;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Welcome back, <span className="text-primary">{user.username}</span></h2>
                <p className="text-subtle">Here is an overview of your progress.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card card">
                    <div className="stat-icon bg-primary-light">
                        <Target size={24} className="text-primary" />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{uniqueProblemsSolved}</span>
                        <span className="stat-label">Problems Solved</span>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon bg-success-light">
                        <Code2 size={24} className="text-success" />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{totalSubmissions}</span>
                        <span className="stat-label">Total Submissions</span>
                    </div>
                </div>

                <div className="stat-card card">
                    <div className="stat-icon bg-warning-light">
                        <Trophy size={24} className="text-warning" />
                    </div>
                    <div className="stat-content">
                        <span className="stat-value">{acceptanceRate}%</span>
                        <span className="stat-label">Acceptance Rate</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-submissions card">
                    <h3 className="section-title"><Clock size={18} /> Recent Submissions</h3>

                    {submissions.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Problem</th>
                                    <th>Status</th>
                                    <th>Language</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.slice(0, 10).map((sub) => (
                                    <tr key={sub.id}>
                                        <td className="font-medium">
                                            <Link to={`/problems/${sub.problem.id}`} className="problem-link">
                                                {sub.problem.title}
                                            </Link>
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${sub.status.toLowerCase()}`}>
                                                {sub.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>{sub.language}</td>
                                        <td className="text-subtle">
                                            {new Date(sub.submittedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="empty-state">
                            <p className="text-subtle">You haven't made any submissions yet.</p>
                            <Link to="/problems" className="btn btn-primary mt-4">Start Solving</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
