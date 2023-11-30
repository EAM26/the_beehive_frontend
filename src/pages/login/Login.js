import React, {useContext} from 'react';
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import './Login.css';
import FormInputField from "../../components/FormInputField/FormInputField";
import {AuthContext} from "../../context/AuthContext";
import {errorHandler} from "../../helpers/errorHandler";
import {postLoginData} from "../../service";
function Login() {

    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onTouched"})
    const {login, error, setError, errorMessage, setErrormessage} = useContext(AuthContext);


    async function handleFormSubmit(data) {
        setError(false)
        setErrormessage("")
        try {
            const loginData = await postLoginData(data)
            login(loginData.jwt, '/')
        } catch (e) {
            setError(true)
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
                        errors={errors}
                        validation={{
                            required: {
                                value: true,
                                message: "Gebruikersnaam is verplicht."
                            }
                        }}

                            />
                            <FormInputField
                            label="Wachtwoord:"
                            name="password"
                            type="password"
                            id="password"
                            placeholder="Typ hier je wachtwoord"
                            register={register}
                            errors={errors}
                            validation={{
                                required: {
                                    value: true,
                                    message: "Wachtwoord is verplicht."
                                }
                            }}
                    />
                    <p className="form-error-message">{error ? errorMessage : ""}</p>
                    <Button type="submit" children="Inloggen"/>
                </form>
            </div>
        </div>
    );
}

export default Login;