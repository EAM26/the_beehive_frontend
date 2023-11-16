import React from 'react';
import './Navbar.css';
import beehiveLogo from '../../assets/beehive.svg';

function Navbar(props) {
    return (
        <nav className="navbar-container">
            <div className="logo-container"><img className="nav-img" src={beehiveLogo} alt="beehive-logo"/>
                <h2>Beehive</h2></div>

            <ul className="navbar-ul">
                <li><a href="/">Personeel</a></li>
                <li><a href="/">Roosters</a></li>
                <button type="button">Login</button>
            </ul>
        </nav>
    );
}


export default Navbar;