import React from 'react';
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import './Login.css';
import FormInputField from "../../components/FormInputField/FormInputField";


function Login() {

    const {register, handleSubmit} = useForm()

    function handleFormSubmit(data) {

        console.log("function handleForm activated: ", data)
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
                    <Button type="submit" children="Inloggen"/>
                </form>
            </div>
        </div>
    );
}

export default Login;