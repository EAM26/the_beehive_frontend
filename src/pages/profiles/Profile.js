import React, {useEffect, useState} from 'react';
import {getProfileData, getSingleEmployeeData, getUserData} from "../../service";
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import FormInputField from "../../components/FormInputField/FormInputField";
import {useParams} from "react-router-dom";

function Profile() {
    let { id } = useParams()

    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onTouched"})
    const [user, setUser] = useState(null)
    const [employee, setEmployee] = useState(null)

    function handleFormSubmit() {
        console.log("handleFormSubmit from Profile")
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(id) {
            console.log("id found: ", id)
            const fetchData = async () => {
                try {
                    const employeeData = await getSingleEmployeeData(token, id)
                    console.log("employeeDAta: " ,employeeData)
                    setEmployee(employeeData)
                } catch (e) {
                    console.error(e)
                }
            }
            void fetchData()

        } else {
            console.log("no id found")
            const fetchData = async () => {
                try {
                    const employeeData = await getProfileData(token)
                    console.log("employeeDAta: " ,employeeData)
                    setEmployee(employeeData)
                } catch (e) {
                    console.error(e)
                }
            }
            void fetchData()

        }

        // const fetchData = async () => {
        //     try {
        //         const employeeData = await getProfileData(token)
        //         console.log("employeeDAta: " ,employeeData)
        //         setEmployee(employeeData)
        //     } catch (e) {
        //         console.error(e)
        //     }
        // }
        // void fetchData()
    }, []);

    return (
        <form
            onSubmit={handleSubmit(handleFormSubmit)}>
            {employee && <p>{employee.firstName}</p>}
            <h2>Gebruikersgegevens</h2>
            <FormInputField
                label="Gebruikersnaam"
                name="username"
                type="text"
                id="username"
                register={register}
                errors={errors}
                defaultValue={user ? user.username : ""}
            />
            <FormInputField
                label="Email"
                name="email"
                type="email"
                id="email"
                register={register}
                errors={errors}
                defaultValue={user ? user.email : ""}
            />
            <FormInputField
                label="Wachtwoord"
                name="password"
                type="password"
                id="password"
                register={register}
                errors={errors}
            />
            {user && user.authorities.map((authObj, index) => {
                const authority = authObj.authority.substring(5)
                return <FormInputField
                    key={index}
                    label="Authority"
                    name={`auth${index}`}
                    type="text"
                    id={`auth${index}`}
                    register={register}
                    errors={errors}
                    defaultValue={authority}
                />
            })}
            <Button type="submit" children="Opslaan"/>
        </form>
    );
}

export default Profile;