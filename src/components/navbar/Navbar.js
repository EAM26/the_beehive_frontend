import React from 'react';
import '../../App.css';
import './Navbar.css';
import Button from "../button/Button";
import beehiveLogo from '../../assets/beehive.svg';
import {NavLink} from "react-router-dom";

function Navbar() {
    return (
        <>
            <nav className="navbar-container">
                <div className="logo-container"><img className="nav-img" src={beehiveLogo} alt="beehive-logo"/>
                    <h2>Beehive</h2></div>

                <ul className="navbar-ul">
                    <NavLink to="/employees">
                        <div>Personeel</div>
                    </NavLink>
                    <li><a href="/">Roosters</a></li>
                    <li><Button type="button" text="Login" className="btn" children="Login"/></li>
                </ul>
            </nav>
        </>
    );
}


export default Navbar;