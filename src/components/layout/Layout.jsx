import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
const Layout = ({ children }) => {
  return (
    <div className="app-container mt-20 px-4 md:px-8 lg:px-16">
      
      <main className="main-content">
        {children}
      </main>
      
    </div>
  );
};

export default Layout; 