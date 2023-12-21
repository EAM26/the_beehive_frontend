import React, {useEffect, useState} from 'react';
import {getProfileData, getSingleEmployeeData, getUserData} from "../../service";
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import FormInputField from "../../components/FormInputField/FormInputField";
import {useParams} from "react-router-dom";
import {getHighestRole} from "../../helpers/getHighestRole";

function Profile() {
    let { id } = useParams()

    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onTouched"})
    const [employee, setEmployee] = useState(null)

    function handleFormSubmit() {
        console.log("handleFormSubmit from Profile")
    }

    useEffect(() => {
        const token = localStorage.getItem('token');

        if(id) {
            const fetchEmployeeData = async () => {
                try {
                    const employeeData = await getSingleEmployeeData(token, id)

                    setEmployee(employeeData)
                } catch (e) {
                    console.error(e)
                }
            }
            void fetchEmployeeData()

        } else {

            const fetchEmployeeData = async () => {
                try {
                    const employeeData = await getProfileData(token)

                    setEmployee(employeeData)
                } catch (e) {
                    console.error(e)
                }
            }
            void fetchEmployeeData()
        }

    }, []);

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}>

            <h2>Gebruikersgegevens</h2>
            <FormInputField
                label="Gebruikersnaam"
                name="username"
                type="text"
                id="username"
                register={register}
                errors={errors}
                defaultValue={employee ? employee.username : ""}
            />
            <FormInputField
                label="Email"
                name="email"
                type="email"
                id="email"
                register={register}
                errors={errors}
                defaultValue={employee ? employee.email : ""}
            />
            <FormInputField
                label="Wachtwoord"
                name="password"
                type="password"
                id="password"
                register={register}
                errors={errors}
            />
            <FormInputField
            label="Authority"
            name="authority"
            type="text"
            id="authority"
            register={register}
            errors={errors}
            defaultValue={employee ? getHighestRole(employee.authorities) : ""}
            />


            <Button type="submit" children="Opslaan"/>
        </form>
    );
}

export default Profile;