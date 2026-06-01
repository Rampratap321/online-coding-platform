import React, { useState, useEffect } from 'react';
import { getProblems } from '../services/problemService';
import ProblemCard from '../components/ProblemCard';
import { Search, Filter } from 'lucide-react';
import './ProblemList.css';

const ProblemList = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('ALL');

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await getProblems();
                setProblems(response.data);
            } catch (err) {
                console.error("Failed to load problems", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, []);

    const filteredProblems = problems.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = difficultyFilter === 'ALL' || p.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
    });

    return (
        <div className="problem-list-container">
            <div className="page-header">
                <h2>Problem Set</h2>
                <p className="text-subtle">Browse and solve coding problems from various categories.</p>
            </div>

            <div className="filters-bar card">
                <div className="search-box">
                    <Search size={18} className="text-subtle" />
                    <input
                        type="text"
                        placeholder="Search problems..."
                        className="form-control"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-box">
                    <Filter size={18} className="text-subtle" />
                    <select
                        className="form-control"
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                    >
                        <option value="ALL">All Difficulties</option>
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading problems...</div>
            ) : (
                <div className="problems-grid">
                    {filteredProblems.length > 0 ? (
                        filteredProblems.map(problem => (
                            <ProblemCard key={problem.id} problem={problem} />
                        ))
                    ) : (
                        <div className="empty-state card col-span-full">
                            <p className="text-subtle">No problems found matching your criteria.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProblemList;
