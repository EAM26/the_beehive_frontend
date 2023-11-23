import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import './Login.css';
import FormInputField from "../../components/FormInputField/FormInputField";
import {AuthContext} from "../../context/AuthContext";
import axios from "axios";
import {errorHandler} from "../../helpers/errorHandler";


function Login() {

    const {register, handleSubmit} = useForm()
    const {login} = useContext(AuthContext);
    const [loginFailed, setLoginFailed] = useState(false);
    const [errorMessage, setErrormessage] = useState("")

    async function handleFormSubmit(data) {
        try {
            const response = await axios.post(`http://localhost:8080/authenticate`, {
                username: data.username,
                password: data.password,
            })
            login(response.data.jwt, '/')
        } catch (e) {
            console.error("Login failed", e)
            setLoginFailed(true)
            setErrormessage(errorHandler(e))
        }
    }

    return (
        <div className="outer-container">
            <div className="inner-container">
                <form className="form-outer-container"
                      onSubmit={handleSubmit(handleFormSubmit)}>
                    <FormInputField
                        label="Gebruikersnaam:"
                        name="username"
                        type="text"
                        id="username"
                        placeholder="Typ hier je gebruikersnaam"
                        register={register}
                    />
                    <FormInputField
                        label="Wachtwoord:"
                        name="password"
                        type="password"
                        id="password"
                        placeholder="Typ hier je wachtwoord"
                        register={register}
                    />
                    <p className="error-message">{loginFailed ? errorMessage : ""}</p>

                    <Button type="submit" children="Inloggen"/>
                </form>
            </div>
        </div>
    );
}

export default Login;