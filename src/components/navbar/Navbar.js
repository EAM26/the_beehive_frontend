import React, {useContext,} from 'react';
import '../../App.css';
import '../../index.css'
import './Navbar.css';
import Button from "../button/Button";
import beehiveLogo from '../../assets/beehive.svg';
import {NavLink, useLocation} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";

function Navbar() {

    const {isAuth, logout, authLevel,} = useContext(AuthContext)
    const location = useLocation();

    const navItems = isAuth ? 2 : 1;
    const navClass = navItems === 1 ? "single-item" : "double-item";

    return (

        <nav className={`navbar-container ${navClass}`}>
            <NavLink to="/">
                <div className="logo-container">
                    <img className="nav-img" src={beehiveLogo} alt="beehive-logo"/>
                    <h1>Beehive</h1>
                </div>
            </NavLink>

            {isAuth && <ul className="navbar-ul">

                {(authLevel === 'admin' || authLevel === 'manager') && (location.pathname !== "/teams" &&
                    <li>
                        <NavLink to="/teams">
                            <h2>Teams</h2>
                        </NavLink>
                    </li>)}
                {(authLevel === 'admin' || authLevel === 'manager') && (location.pathname !== "/users" &&
                    <li>
                        <NavLink to="/users">
                            <h2>Users</h2>
                        </NavLink>
                    </li>)}
                {(authLevel === 'admin' || authLevel === 'manager') && (location.pathname !== "/rosters" &&
                    <li>
                        <NavLink to="/rosters">
                            <h2>Rosters</h2>
                        </NavLink>
                    </li>)}
                {location.pathname !== "/profile" &&
                    <li>
                        <NavLink to="/profile">
                            <h2>Profile</h2>
                        </NavLink>
                    </li>}
                <Button type="button" className="btn-blue" children="Logout" onClick={logout}/>
            </ul>}
        </nav>

    );
}


export default Navbar;
