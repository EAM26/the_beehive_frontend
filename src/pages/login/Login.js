import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import './Login.css';
import singleBee from '../../assets/single_bee.png'
import FormInputField from "../../components/FormInputField/FormInputField";
import {AuthContext} from "../../context/AuthContext";
import {errorHandler} from "../../helpers/errorHandler";
import {postLoginData} from "../../service";

function Login() {

    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onTouched"})
    const {login, error, setError, errorMessage, setErrormessage} = useContext(AuthContext);
    const [loading, setLoading] = useState(false)


    async function handleFormSubmit(data) {
        setLoading(true);
        setError(false);
        setErrormessage("");
        try {
            const loginData = await postLoginData(data)
            login(loginData.jwt, '/')
        } catch (e) {
            setError(true)
            setErrormessage(errorHandler(e))
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="outer-container">
            <div className="inner-container">
                {loading && <p className="loading-text">Loading page...</p>}
                {error && <p className="error-message">{errorMessage}</p>}
                <div className="login-page">
                    <form className="login-form"
                          onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="log-form-head">
                            <h2>Login</h2>
                            <img src={singleBee} alt="singlebee-img"/>
                        </div>
                        <div
                            className="log-form-field"
                        >
                            <FormInputField
                                name="username"
                                type="text"
                                id="username"
                                placeholder="Username"
                                register={register}
                                errors={errors}
                                validation={{
                                    required: {
                                        value: true,
                                        message: "Username is required."
                                    }
                                }}
                            />
                            <FormInputField
                                name="password"
                                type="password"
                                id="password"
                                placeholder="Password"
                                register={register}
                                errors={errors}
                                validation={{
                                    required: {
                                        value: true,
                                        message: "Password is required."
                                    }
                                }}
                            />
                        </div>
                        <a href="">Forgot password?</a>
                        <Button className="btn-blue" type="submit" children="Login"/>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Login;