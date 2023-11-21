import React, {createContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import axios from "axios";


export const AuthContext = createContext({});

function AuthContextProvider({children}) {

    const [authState, setAuthState] = useState({
        isAuth: false,
        user: null,
        status: 'pending'});

    const navigate  = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if(storedToken) {
            login(storedToken)
        } else {
            logout()
        }

    }, []);

    async function fetchUserData(jwt, redirect) {
        try {
            const response = await axios.get('http://localhost:8080/authenticated', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwt}`
                }
            })
            setAuthState( {
                ...authState,
                isAuth: true,
                user: {
                    username: response.data.username,
                    authorities: response.data.authorities
                },
                status: "done",

            })
            console.log("function fetchUserData activated: ", response.data)
            if(redirect) navigate(redirect)
        } catch (e) {
            console.error("Couldn't fetch userdata: ", e)
        }
    }
    function login(jwt, redirect) {
        console.log("login function activated")
        const decodedToken = jwtDecode(jwt)
        console.log("decodedToken: ", decodedToken)
        localStorage.setItem('token', jwt)
        fetchUserData(jwt, redirect)
    }

    function logout() {
        console.log("logout function")
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
    };


    return (
        <AuthContext.Provider value={contextData}>
            { authState.status === "done" ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;