import React, {useContext, useEffect, useState} from 'react';
import '../../App.css';
import './Navbar.css';
import Button from "../button/Button";
import beehiveLogo from '../../assets/beehive.svg';
import {NavLink, useLocation} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";

function Navbar() {

    const {isAuth, user, logout, hasAdminOrManagerRole, hasAuthLevel, setHasAuthLevel} = useContext(AuthContext)
    const location = useLocation();

    const navItems = isAuth? 2: 1;
    const navClass = navItems === 1 ? "single-item" : "double-item";
    



    // function hasAdminOrManagerRole(userObject) {
    //     return userObject.authorities.some(auth =>
    //             auth.authority === 'ROLE_ADMIN' || auth.authority === 'ROLE_MANAGER'
    //         );
    // }


    useEffect(()=> {
        if(user) {
            setHasAuthLevel(hasAdminOrManagerRole(user))
            console.log(user)
        }
    }, [user])


    return (

        <nav className={`navbar-container ${navClass}`}>
            <NavLink to="/">
                <div className="logo-container">
                    <img className="nav-img" src={beehiveLogo} alt="beehive-logo"/>
                    <h2>Beehive</h2>
                </div>
            </NavLink>

            {isAuth && <ul className="navbar-ul">
                {hasAuthLevel && (location.pathname !== "/employees" &&
                    <li>
                        <NavLink to="/employees">
                            Personeel
                        </NavLink>
                    </li>)}
                {hasAuthLevel && (location.pathname !== "/rosters" &&
                    <li>
                        <NavLink to="/rosters">
                            Roosters
                        </NavLink>
                    </li>)}
                {location.pathname !== "/profile" &&
                    <li>
                        <NavLink to="/profile">
                            Profiel
                        </NavLink>
                    </li>}
                <Button type="button" className="btn" children="Logout" onClick={logout}/>
            </ul>}
        </nav>

    );
}


export default Navbar;
