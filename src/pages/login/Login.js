import React from 'react';
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import './Login.css';

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
                    <label
                        htmlFor="username">
                        Gebruikersnaam:
                        <input
                            type="text"
                            id="username"
                            placeholder="Typ hier je gebruikersnaam"
                            {...register("username")}
                        />
                    </label>
                    <label
                        htmlFor="password">
                        Wachtwoord:
                        <input
                            type="password"
                            id="password"
                            placeholder="Typ hier je wachtwoord"
                            {...register("password")}
                        />
                    </label>

                    <Button type="submit" children="Submit"/>
                </form>
            </div>
        </div>
    );
}

export default Login;