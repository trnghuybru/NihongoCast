import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes, FaBook, FaUser } from 'react-icons/fa';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="brand-name">
            Flash<span>Learn</span>
          </div>
        </Link>
        
        <button className="navbar-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
        
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
            Home
          </NavLink>
          <NavLink to="/decks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Decks
          </NavLink>
          <div className="user-menu">
            <div className="user-avatar" onClick={toggleUserMenu}>
              <FaUser />
            </div>
            
            <div className={`dropdown-menu ${userMenuOpen ? 'show' : ''}`}>
              <Link to="/profile" className="dropdown-item">
                <FaUser /> Profile
              </Link>
              <Link to="/decks" className="dropdown-item">
                <FaBook /> My Decks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 