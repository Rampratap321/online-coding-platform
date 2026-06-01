import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Code, Trophy, Users } from 'lucide-react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <section className="hero-section text-center">
                <div className="hero-badge">Online Coding Practice Platform</div>
                <h1 className="hero-title">Master Your Coding Skills</h1>
                <p className="hero-subtitle">
                    Practice coding problems, prepare for technical interviews, and climb the leaderboard.
                    Join our community of developers leveling up their engineering skills.
                </p>
                <div className="hero-actions">
                    <Link to="/register" className="btn btn-primary btn-large">Get Started</Link>
                    <Link to="/problems" className="btn btn-outline btn-large">Explore Problems</Link>
                </div>
            </section>

            <section className="features-section">
                <div className="feature-card card">
                    <div className="feature-icon bg-primary-light">
                        <Terminal size={24} className="text-primary" />
                    </div>
                    <h3>Interactive Editor</h3>
                    <p className="text-subtle">Write code directly in browser using our blazing fast VS Code based editor.</p>
                </div>

                <div className="feature-card card">
                    <div className="feature-icon bg-success-light">
                        <Code size={24} className="text-success" />
                    </div>
                    <h3>Curated Problems</h3>
                    <p className="text-subtle">Hundreds of hand-picked algorithmic problems ranging from Easy to Hard.</p>
                </div>

                <div className="feature-card card">
                    <div className="feature-icon bg-warning-light">
                        <Trophy size={24} className="text-warning" />
                    </div>
                    <h3>Global Leaderboard</h3>
                    <p className="text-subtle">Compete with friends and peers around the globe and track your rank.</p>
                </div>

                <div className="feature-card card">
                    <div className="feature-icon bg-danger-light">
                        <Users size={24} className="text-danger" />
                    </div>
                    <h3>Community Discussions</h3>
                    <p className="text-subtle">Learn from others by reading insightful discussions and alternate solutions.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
