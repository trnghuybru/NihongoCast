import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-name">
              Flash<span>Learn</span>
            </div>
            <p className="brand-desc">
              Modern flashcard application for effective learning
            </p>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/decks">Decks</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h4>Contact</h4>
            <p>Email: info@flashlearn.com</p>
            <div className="social-links">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} FlashLearn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 