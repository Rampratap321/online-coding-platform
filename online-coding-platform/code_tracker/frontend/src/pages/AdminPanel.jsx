import React, { useState, useEffect, useContext } from 'react';
import { getProblems, createProblem, updateProblem, deleteProblem } from '../services/problemService';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        difficulty: 'EASY',
        tags: ''
    });

    useEffect(() => {
        if (!user || !user.roles?.includes('ROLE_ADMIN')) {
            navigate('/');
            return;
        }
        fetchProblems();
    }, [user, navigate]);

    const fetchProblems = async () => {
        try {
            const res = await getProblems();
            setProblems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (problem) => {
        setFormData({
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            tags: problem.tags || ''
        });
        setEditingId(problem.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this problem?")) {
            try {
                await deleteProblem(id);
                fetchProblems();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateProblem(editingId, formData);
            } else {
                await createProblem(formData);
            }
            setShowForm(false);
            setEditingId(null);
            fetchProblems();
        } catch (err) {
            console.error("Failed to save problem", err);
        }
    };

    if (loading) return <div className="loading-state">Loading admin panel...</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h2>Admin Control Panel</h2>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setEditingId(null);
                        setFormData({ title: '', description: '', difficulty: 'EASY', tags: '' });
                        setShowForm(!showForm);
                    }}
                >
                    {showForm ? 'Cancel' : <><Plus size={16} /> New Problem</>}
                </button>
            </div>

            {showForm && (
                <div className="card admin-form-card">
                    <h3>{editingId ? 'Edit Problem' : 'Create New Problem'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                className="form-control" type="text" required
                                value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-control" rows="5" required
                                value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Difficulty</label>
                                <select
                                    className="form-control"
                                    value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                >
                                    <option value="EASY">EASY</option>
                                    <option value="MEDIUM">MEDIUM</option>
                                    <option value="HARD">HARD</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Tags (comma separated)</label>
                                <input
                                    className="form-control" type="text"
                                    value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">Save Problem</button>
                    </form>
                </div>
            )}

            <div className="card admin-table-card">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Difficulty</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {problems.map(problem => (
                            <tr key={problem.id}>
                                <td>{problem.id}</td>
                                <td className="font-medium text-white">{problem.title}</td>
                                <td>
                                    <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                                        {problem.difficulty}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn btn-outline btn-sm action-btn" onClick={() => handleEdit(problem)}>
                                            <Edit2 size={14} />
                                        </button>
                                        <button className="btn btn-outline btn-sm action-btn text-danger" onClick={() => handleDelete(problem.id)}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;
