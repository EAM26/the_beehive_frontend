import React, {useEffect, useState} from 'react';
import {getSelf} from "../../service";
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import FormInputField from "../../components/FormInputField/FormInputField";
import {getHighestRole} from "../../helpers/getHighestRole";
import {errorHandler} from "../../helpers/errorHandler";
import Checkbox from "../../components/checkbox/Checkbox";

function Profile() {


    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onTouched"})
    const [self, setSelf] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")

    function handleFormSubmitUser() {
        console.log("handleFormSubmit from Profile")
    }
    function handleFormSubmitEmployee() {
        console.log("handleFormSubmit from Profile")
    }

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchSelfData = async () => {
            // setLoading(true);
            try {
                const selfData = await getSelf(token);
                setSelf(selfData);
            } catch (e) {
                console.log(e)
                setError(true);
                setErrormessage(errorHandler(e));
            } finally {
                setLoading(false);
            }
        }
        void fetchSelfData(self)




    }, []);



    if (!self) {
        return <div>Loading...</div>;
    } else {

        return (

            <main>
                <form
                    onSubmit={handleSubmit(handleFormSubmitUser)}>
                    <h2>User Data</h2>
                    <FormInputField
                        label="User name"
                        name="username"
                        type="text"
                        id="username"
                        register={register}
                        errors={errors}
                        defaultValue={self ? self.username : ""}
                    />
                    <FormInputField
                        label="Email"
                        name="email"
                        type="email"
                        id="email"
                        register={register}
                        errors={errors}
                        defaultValue={self ? self.email : "leeg"}
                    />
                    <FormInputField
                        label="Password"
                        name="password"
                        type="password"
                        id="password"
                        register={register}
                        errors={errors}
                    />


                    <FormInputField
                        label="Status"
                        name="isDeleted"
                        type="text"
                        id="isDeleted"
                        register={register}
                        errors={errors}
                        defaultValue={self.isDeleted ? "Not Active" : "Active"}
                    />

                    <FormInputField
                        label="Authority"
                        name="authority"
                        type="text"
                        id="authority"
                        register={register}
                        errors={errors}
                        defaultValue={self ? getHighestRole(self.authorities) : ""}
                    />

                    <Button type="submit" children="Opslaan"/>
                </form>
                <form
                    onSubmit={handleSubmit(handleFormSubmitEmployee)}>
                    <h2>Employee Data</h2>
                    <FormInputField
                        label="Employee Id"
                        name="empId"
                        type="text"
                        id="empId"
                        register={register}
                        errors={errors}
                        defaultValue={self ? self.employee.id : ""}
                    />
                    <FormInputField
                        label="First name"
                        name="firstName"
                        type="text"
                        id="firstName"
                        register={register}
                        errors={errors}
                        defaultValue={self ? self.employee.firstName : ""}
                    />
                    <FormInputField
                        label="Preposition"
                        name="preposition"
                        type="text"
                        id="firprepositionstName"
                        register={register}
                        errors={errors}
                        defaultValue={self ? self.employee.preposition : ""}
                    />
                    <FormInputField
                        label="Last name"
                        name="lastName"
                        type="text"
                        id="lastName"
                        register={register}
                        errors={errors}
                        defaultValue={self ? self.employee.lastName : ""}
                    />
                    <FormInputField
                        label="Short name"
                        name="shortName"
                        type="text"
                        id="shortName"
                        register={register}
                        errors={errors}
                        defaultValue={self ? self.employee.shortName : ""}
                    />
                    <FormInputField
                        label="Emp Status"
                        name="empActive"
                        type="text"
                        id="empActive"
                        register={register}
                        errors={errors}
                        defaultValue={self.employee.isActive ? "Active" : "Not Active"}
                    />
                    <FormInputField
                        label="Team"
                        name="team"
                        type="text"
                        id="team"
                        register={register}
                        errors={errors}
                        defaultValue={self? self.team.teamName : ""}
                    />

                    <Button type="submit" children="Opslaan"/>
                </form>

            </main>
        );
    }
}

export default Profile;