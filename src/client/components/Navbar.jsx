import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaPlus, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useUser } from './UserContext';
import NewsForm from './news/NewsForm';
import axios from 'axios';
import '../styles/navbar.css';

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, profilePic, setUser, setProfilePic } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        document.querySelector('.navbar').classList.add('scrolled');
      } else {
        document.querySelector('.navbar').classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <h1>
              <span>K</span>hattak <span>B</span>elt
            </h1>
          </Link>

          <div className="menu-icon" onClick={() => setIsMobile(!isMobile)}>
            {isMobile ? <FaTimes /> : <FaBars />}
          </div>

          <ul className={isMobile ? 'nav-menu active' : 'nav-menu'}>
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? 'nav-links active-link' : 'nav-links')}
                onClick={() => setIsMobile(false)}
              >
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/news"
                className={({ isActive }) => (isActive ? 'nav-links active-link' : 'nav-links')}
                onClick={() => setIsMobile(false)}
              >
                News
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/sports"
                className={({ isActive }) => (isActive ? 'nav-links active-link' : 'nav-links')}
                onClick={() => setIsMobile(false)}
              >
                Sports
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/education"
                className={({ isActive }) => (isActive ? 'nav-links active-link' : 'nav-links')}
                onClick={() => setIsMobile(false)}
              >
                Education
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/culture"
                className={({ isActive }) => (isActive ? 'nav-links active-link' : 'nav-links')}
                onClick={() => setIsMobile(false)}
              >
                Culture
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/arts"
                className={({ isActive }) => (isActive ? 'nav-links active-link' : 'nav-links')}
                onClick={() => setIsMobile(false)}
              >
                Arts
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/travel"
                className={({ isActive }) => (isActive ? 'nav-links active-link' : 'nav-links')}
                onClick={() => setIsMobile(false)}
              >
                Travel
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to="/contact"
                className={({ isActive }) => (isActive ? 'nav-links active-link' : 'nav-links')}
                onClick={() => setIsMobile(false)}
              >
                Contact
              </NavLink>
            </li>

            <div className="mobile-buttons">
              {user ? (
                <>
                  <button
                    className="btn-create-post"
                    onClick={() => {
                      setShowNewsForm(true);
                      setIsMobile(false);
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : (
                      <>
                        <FaPlus /> Create Post
                      </>
                    )}
                  </button>
                  <Link to="/profile" className="btn-profile" onClick={() => setIsMobile(false)}>
                    {profilePic ? (
                      <img src={profilePic} alt="Profile" className="profile-pic-nav" />
                    ) : (
                      <FaUser />
                    )}
                  </Link>
                
                </>
              ) : (
                <>
                  <Link to="/register" className="btn-register" onClick={() => setIsMobile(false)}>
                    Register
                  </Link>
                  <Link to="/login" className="btn-signin" onClick={() => setIsMobile(false)}>
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </ul>
        </div>
      </nav>

      {showNewsForm && (
        <div className={`news-form-modal ${showNewsForm ? 'active' : ''}`}>
          <div className="modal-content">
            <button 
              className="close-modal" 
              onClick={() => setShowNewsForm(false)}
              disabled={isLoading}
            >
              &times;
            </button>
            <NewsForm 
              onSuccess={() => {
                setShowNewsForm(false);
                setIsMobile(false);
              }} 
            />
          </div>
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
    </>
  );
}