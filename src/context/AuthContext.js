import React, {createContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import checkTokenValidity from "../helpers/checkTokenValidity";


export const AuthContext = createContext({});

function AuthContextProvider({children}) {

    function hasAdminOrManagerRole(userObject) {
        return userObject.authorities.some(auth =>
            auth.authority === 'ROLE_ADMIN' || auth.authority === 'ROLE_MANAGER'
        );
    }


    const [hasAuthLevel, setHasAuthLevel] = useState(false);

    const [authState, setAuthState] = useState({
        isAuth: false,
        user: null,
        status: 'pending'});
    const navigate  = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if(storedToken && checkTokenValidity(storedToken)) {
            login(storedToken)
        } else {
            logout()
        }

    }, []);

    async function fetchUserData(jwt, redirect) {
        try {
            const {data: { principal, authorities } } = await axios.get('http://localhost:8080/authenticated', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`
                }
            })
            setAuthState( {
                ...authState,
                isAuth: true,
                user: {
                    username: principal.username,
                    authorities: authorities

                },
                status: "done",
            })

            if(redirect) navigate(redirect)
        } catch (e) {
            console.error("Couldn't fetch userdata: ", e)
        }
    }
    function login(jwt, redirect) {
        localStorage.setItem('token', jwt)
         void fetchUserData(jwt, redirect)

    }

    function logout() {
        localStorage.removeItem('token')
        setAuthState( {
            ...authState,
            isAuth: false,
            user: null,
            status: "done",
        })
        navigate('/login')
    }

    const contextData = {
        isAuth: authState.isAuth,
        user: authState.user,
        login: login,
        logout: logout,
        hasAdminOrManagerRole: hasAdminOrManagerRole,
        hasAuthLevel: hasAuthLevel,
        setHasAuthLevel: setHasAuthLevel,

    };


    return (
        <AuthContext.Provider value={contextData}>
            { authState.status === "done" ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;