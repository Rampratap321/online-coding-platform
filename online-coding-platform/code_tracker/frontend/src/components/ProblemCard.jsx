import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Target, Clock } from 'lucide-react';
import './ProblemCard.css';

const ProblemCard = ({ problem }) => {
    return (
        <div className="problem-card card">
            <div className="problem-card-header">
                <h3 className="problem-title">{problem.title}</h3>
                <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                </span>
            </div>

            <div className="problem-card-body">
                <p className="problem-desc">
                    {problem.description.substring(0, 120)}...
                </p>
            </div>

            <div className="problem-card-footer">
                <div className="problem-meta">
                    <span className="meta-item"><Target size={14} /> ID: {problem.id}</span>
                </div>
                <Link to={`/problems/${problem.id}`} className="btn btn-outline solve-btn">
                    Solve <ChevronRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default ProblemCard;
