import React from 'react';
import { Trophy } from 'lucide-react';
import './LeaderboardTable.css';

const LeaderboardTable = ({ data }) => {
    return (
        <div className="table-container card">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>Problems Solved</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user, index) => (
                        <tr key={index} className={index < 3 ? 'top-rank' : ''}>
                            <td className="rank-cell">
                                {index === 0 && <Trophy size={18} className="text-warning-color" />}
                                {index === 1 && <Trophy size={18} color="#C0C0C0" />}
                                {index === 2 && <Trophy size={18} color="#cd7f32" />}
                                {index > 2 && index + 1}
                            </td>
                            <td className="user-cell font-semibold">{user.user.username}</td>
                            <td>{user.problemsSolved}</td>
                            <td className="score-cell font-semibold text-primary">{user.score} pt</td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan="4" className="text-center text-subtle py-4">
                                No users on the leaderboard yet.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LeaderboardTable;
