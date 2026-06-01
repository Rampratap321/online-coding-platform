import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProblemById } from '../services/problemService';
import { submitCode } from '../services/submissionService';
import { AuthContext } from '../context/AuthContext';
import CodeEditor from '../components/CodeEditor';
import './ProblemDetails.css'; // Reuse some layout styles

const CodeEditorPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchProblem = async () => {
            try {
                const res = await getProblemById(id);
                setProblem(res.data);
            } catch (err) {
                console.error("Failed to load problem", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [id, user, navigate]);

    const handleCodeSubmit = async (code, language) => {
        if (!code.trim()) return;

        setSubmitting(true);
        setResult(null);
        try {
            const res = await submitCode(id, code, language);
            setResult(res.data);
        } catch (err) {
            console.error("Submission failed", err);
            setResult({ error: "Failed to connect to judgment server." });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-state">Loading editor environment...</div>;
    if (!problem) return <div className="empty-state">Problem not found.</div>;

    return (
        <div className="code-editor-page">
            <div className="problem-header card" style={{ padding: '1rem 1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{problem.title}</h2>
                    <button className="btn btn-outline" onClick={() => navigate(`/problems/${id}`)}>
                        View Description
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <CodeEditor
                    language="java"
                    defaultCode={`public class Solution {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}`}
                    onSubmit={handleCodeSubmit}
                    loading={submitting}
                />
            </div>

            {result && (
                <div className={`card mt-4 ${result.status === 'ACCEPTED' ? 'bg-success-light' : 'bg-danger-light'}`}>
                    <h3 className={result.status === 'ACCEPTED' ? 'text-success' : 'text-danger'} style={{ marginTop: 0 }}>
                        {result.status ? result.status.replace('_', ' ') : 'Error'}
                    </h3>

                    {result.status && (
                        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                            <div>
                                <span className="text-subtle">Runtime: </span>
                                <strong>{result.runtime?.toFixed(1) || 0} ms</strong>
                            </div>
                            <div>
                                <span className="text-subtle">Memory: </span>
                                <strong>{result.memory?.toFixed(1) || 0} MB</strong>
                            </div>
                            <div>
                                <span className="text-subtle">Language: </span>
                                <strong>{result.language}</strong>
                            </div>
                        </div>
                    )}
                    {result.error && <p className="text-danger">{result.error}</p>}
                </div>
            )}
        </div>
    );
};

export default CodeEditorPage;
