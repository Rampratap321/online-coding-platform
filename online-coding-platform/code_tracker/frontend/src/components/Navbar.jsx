import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Code2, LogOut, User as UserIcon } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <Code2 className="navbar-icon" />
                    <span>DevPractice</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/problems" className="nav-link">Problems</Link>
                    <Link to="/leaderboard" className="nav-link">Leaderboard</Link>

                    {user ? (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            {user.roles && user.roles.includes("ROLE_ADMIN") && (
                                <Link to="/admin" className="nav-link admin-link">Admin Panel</Link>
                            )}
                            <div className="navbar-user">
                                <span className="user-greeting"><UserIcon size={16} /> {user.username}</span>
                                <button className="btn btn-outline" onClick={handleLogout}>
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="navbar-auth">
                            <Link to="/login" className="btn btn-outline">Sign In</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
