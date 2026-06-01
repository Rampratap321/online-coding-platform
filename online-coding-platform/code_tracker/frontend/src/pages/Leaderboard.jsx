import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../services/leaderboardService';
import LeaderboardTable from '../components/LeaderboardTable';
import { Trophy } from 'lucide-react';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await getLeaderboard();
                setLeaderboard(response.data);
            } catch (err) {
                console.error("Failed to load leaderboard", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="leaderboard-page">
            <div className="leaderboard-header text-center">
                <div className="leaderboard-icon">
                    <Trophy size={48} className="text-warning" />
                </div>
                <h2>Global Leaderboard</h2>
                <p className="text-subtle max-w-2xl mx-auto">
                    Top developers ranked by problems solved. Solve harder problems to earn more points and climb the ranks!
                </p>
            </div>

            {loading ? (
                <div className="loading-state">Loading rankings...</div>
            ) : (
                <div className="leaderboard-content max-w-4xl mx-auto">
                    <LeaderboardTable data={leaderboard} />
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
