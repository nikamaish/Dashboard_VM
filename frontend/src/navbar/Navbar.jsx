import React, { useState } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-regular-svg-icons';

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div>
      <nav className={`navbar ${showMenu ? 'active' : ''}`}>
        <div className="navbar-brand">
          <a className="navbar-logo" href="/"></a>
        </div>
        <button className="menu-button" onClick={toggleMenu}>
          <div className={`menu-icon ${showMenu ? 'active' : ''}`}>
            <span></span> 
            <span></span>
            <span></span>
          </div>
        </button>
        <div className="navbar-menu">
          <ul className={`navbar-items ${showMenu ? 'active' : ''}`}>
            <li><Link to={'/'}>Home</Link></li>
            <li><Link to={'/'}>Dashboard</Link></li>
            <li><Link to={'/signup'}><FontAwesomeIcon icon={faUser} /></Link></li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
