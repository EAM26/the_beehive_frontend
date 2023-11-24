import React, {useContext} from 'react';
import '../../App.css';
import './Navbar.css';
import Button from "../button/Button";
import beehiveLogo from '../../assets/beehive.svg';
import {NavLink} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";

function Navbar() {

    const {isAuth, login, logout} = useContext(AuthContext)
    return (
        <nav className="navbar-container">
            <NavLink to="/">
                <div className="logo-container">
                    <img className="nav-img" src={beehiveLogo} alt="beehive-logo"/>
                    <h2>Beehive</h2>
                </div>
            </NavLink>

            {isAuth && <ul className="navbar-ul">
                <li>
                    <NavLink to="/employees">
                        Personeel
                    </NavLink>
                </li>
                <li><NavLink to="/rosters">
                    Roosters
                </NavLink>
                </li>
                <li><NavLink to="/profile">
                    Profiel
                </NavLink>
                </li>
                <Button type="button" className="btn" children="Logout" onClick={logout}/>
            </ul>}
        </nav>
    );
}


export default Navbar;
