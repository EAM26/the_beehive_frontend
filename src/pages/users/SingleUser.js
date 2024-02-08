import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {getUser} from "../../service";
import {AuthContext} from "../../context/AuthContext";
import {errorHandler} from "../../helpers/errorHandler";
import FormInputField from "../../components/FormInputField/FormInputField";
import {useForm} from "react-hook-form";


function SingleUser(props) {
    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onTouched"})
    const {username} = useParams();
    const {token} = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")

    useEffect(() => {
            setLoading(true);
            const fetchData = async () => {
                try {
                    const user = await getUser(token, username);

                    if (user.shifts) {
                        user.shifts.sort((a, b) => new Date(a.startShift) - new Date(b.startShift));
                    }
                    if (user.absences) {
                        user.absences.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                    }
                    setUserData(user);

                } catch (e) {
                    setError(true);
                    setErrormessage(errorHandler(e))
                } finally {

                }
                setLoading(false);
            };

            void fetchData();

        },
        []);

    console.log(userData)
    return (
        <main>
            <div>
                <div>
                    <form action="">
                        <FormInputField
                            label="User name"
                            name="username"
                            type="text"
                            id="username"
                            register={register}
                            errors={errors}
                            defaultValue={userData ? userData.username : ""}
                            readOnly={true}
                        />
                    </form></div>
            </div>
        </main>
    );
}


export default SingleUser;