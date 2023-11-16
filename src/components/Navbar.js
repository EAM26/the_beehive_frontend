import React from 'react';
import './Navbar.css';
import beehiveLogo from '../assets/beehive.svg';

function Navbar(props) {
    return (
        <div>
            <img src={beehiveLogo} alt="beehive-logo"/>
        </div>
    );
}

export default Navbar;