import React, {createContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";


export const AuthContext = createContext({});

function AuthContextProvider({children}) {

    const [authState, setAuthState] = useState({
        isAuth: false,
        user: null,
        status: 'pending'});

    const {navigate} = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('token')
        if(storedToken) {
            login(storedToken)
        }
    }, []);

    function login() {
        console.log("login function ")
    }

    function logout() {
        console.log("logout function")
    }

    const contextData = {

    }
    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;