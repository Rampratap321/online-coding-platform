import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProblemById } from '../services/problemService';
import { getProblemSubmissions } from '../services/submissionService';
import { Code, Hash, AlignLeft, Info } from 'lucide-react';
import './ProblemDetails.css';

const ProblemDetails = () => {
    const { id } = useParams();
    const [problem, setProblem] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProblemData = async () => {
            try {
                const probRes = await getProblemById(id);
                setProblem(probRes.data);

                // try to fetch recent submissions for this problem
                const subRes = await getProblemSubmissions(id);
                setSubmissions(subRes.data);
            } catch (err) {
                console.error("Failed to load problem details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProblemData();
    }, [id]);

    if (loading) return <div className="loading-state">Loading problem details...</div>;
    if (!problem) return <div className="empty-state">Problem not found.</div>;

    const acceptedCount = submissions.filter(s => s.status === 'ACCEPTED').length;
    const acceptanceRate = submissions.length > 0
        ? Math.round((acceptedCount / submissions.length) * 100)
        : 0;

    return (
        <div className="problem-details-container">
            <div className="problem-header card">
                <div className="title-row">
                    <h2>{problem.title}</h2>
                    <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                        {problem.difficulty}
                    </span>
                </div>

                <div className="problem-meta-bar">
                    <span className="meta-item"><Hash size={14} /> ID: {problem.id}</span>
                    <span className="meta-item"><AlignLeft size={14} />
                        {problem.tags ? problem.tags.split(',').length : 0} Tags
                    </span>
                    <span className="meta-item"><Info size={14} /> Accepts: {acceptanceRate}%</span>
                </div>

                <div className="problem-actions mt-4">
                    <Link to={`/code/${problem.id}`} className="btn btn-primary">
                        <Code size={16} /> Write Code
                    </Link>
                </div>
            </div>

            <div className="problem-body">
                <div className="description-card card">
                    <h3>Description</h3>
                    <div className="description-text">
                        {/* Assuming description is potentially html or plain text, simplistic render here */}
                        {problem.description.split('\n').map((para, i) => (
                            <p key={i}>{para}</p>
                        ))}
                    </div>
                </div>

                <div className="sidebar">
                    <div className="tags-card card">
                        <h3>Tags</h3>
                        <div className="tags-list">
                            {problem.tags ? problem.tags.split(',').map((tag, i) => (
                                <span key={i} className="tag-pill">{tag.trim()}</span>
                            )) : <span className="text-subtle">No tags</span>}
                        </div>
                    </div>

                    <div className="submissions-card card">
                        <h3>Submissions Analytics</h3>
                        <ul className="stats-list">
                            <li>Total Submissions: {submissions.length}</li>
                            <li>Accepted: {acceptedCount}</li>
                            <li>Acceptance Rate: {acceptanceRate}%</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProblemDetails;
