import React, {createContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {checkTokenValidity} from "../helpers/checkTokenValidity";
import {getHighestRole} from "../helpers/getHighestRole";
import {errorHandler} from "../helpers/errorHandler";
import {getAuthData} from "../service";


export const AuthContext = createContext({});

function AuthContextProvider({children}) {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const [authLevel, setAuthLevel] = useState('');
    const [authState, setAuthState] = useState({
        isAuth: false,
        user: null,
        status: 'pending'
    });

    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")


    useEffect(() => {

        if (token && checkTokenValidity(token)) {
            login(token)
        } else {
            logout()
        }

    }, []);

    async function fetchData(jwt, redirect) {
        try {
            const { principal, authorities} = await getAuthData(jwt);
            setAuthState({
                ...authState,
                isAuth: true,
                user: {
                    username: principal.username,
                    authorities: authorities

                },
                status: "done"
            })
            setAuthLevel(getHighestRole(authorities))
        } catch (e) {
            setError(true)
            setErrormessage(errorHandler(e))
            setAuthState({
                ...authState,
                status: 'done'
            })

        }
        finally {
            if (redirect) navigate(redirect)
        }

    }

    function login(jwt, redirect) {
        localStorage.setItem('token', jwt)
        setToken(jwt)
        void fetchData(jwt, redirect)
    }

    function logout() {
        localStorage.removeItem('token')
        setAuthState({
            ...authState,
            isAuth: false,
            user: null,
            status: "done",
        })
        navigate('/login')
        setToken('')
    }

    const authContextData = {
        isAuth: authState.isAuth,
        user: authState.user,
        login,
        logout,
        authLevel,
        error,
        setError,
        errorMessage,
        setErrormessage,
        token
    };


    return (
        <AuthContext.Provider value={authContextData}>
            {authState.status === "done" ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;