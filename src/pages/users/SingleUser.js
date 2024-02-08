import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {getUser} from "../../service";
import {AuthContext} from "../../context/AuthContext";
import {errorHandler} from "../../helpers/errorHandler";
import FormInputField from "../../components/FormInputField/FormInputField";
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";


function SingleUser(props) {
    const {register, handleSubmit, formState: {errors}, setValue} = useForm({
        mode: "onTouched",
        defaultValues: {
            isDeleted: false,
            isEmpActive: false,
        }
    })
    const {username} = useParams();
    const {token} = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const [isDeleted, setIsDeleted] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const handleFormSubmitEmployee = async (formData) => {
        try {
            console.log("handleformsubmit");
        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
        }
    }

    useEffect(() => {
            setLoading(true);
            const fetchData = async () => {
                try {
                    const user = await getUser(token, username);
                    console.log(user)
                    if (user.shifts) {
                        user.shifts.sort((a, b) => new Date(a.startShift) - new Date(b.startShift));
                    }
                    if (user.absences) {
                        user.absences.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                    }
                    setUserData(user);
                    setValue('isEmpActive', user.employee?.isActive)
                    setValue('Deleted', user.isDeleted)

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

    if (!userData) {
        return <div>Loading...</div>;
    }

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
                        <FormInputField
                            label="Email"
                            name="email"
                            type="email"
                            id="email"
                            register={register}
                            errors={errors}
                            defaultValue={userData ? userData.email : ""}
                            validation={{
                                required:
                                    {
                                        value: true,
                                        message: "Field is required",
                                    }, pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i,
                                    message: "Not a valid email address"
                                }
                            }
                            }
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
                            label="Authority"
                            name="userRole"
                            type="text"
                            id="userRole"
                            register={register}
                            errors={errors}
                            defaultValue={userData ? userData.authorities[0].authority.replace('ROLE_', '') : ""}
                            validation={{
                                required:
                                    {
                                        value: true,
                                        message: "Field is required",
                                    }
                            }
                            }
                        />
                        <FormInputField
                            label="Deleted"
                            name="isDeleted"
                            type="checkbox"
                            id="isDeleted"
                            register={register}
                            errors={errors}
                        />
                        <Button type="submit" children="Opslaan"/>
                    </form>

                    <form onSubmit={handleSubmit(handleFormSubmitEmployee)} className="form-inner-container">
                        <h3>Employee</h3>
                        <FormInputField
                            label="Employee id"
                            name="id"
                            type="number"
                            id="id"
                            register={register}
                            errors={errors}
                            defaultValue={userData.employee ? userData.employee.id : ""}
                            readOnly={true}
                        />


                        <FormInputField
                            label="First Name"
                            name="firstName"
                            type="text"
                            id="firstName"
                            register={register}
                            errors={errors}
                            defaultValue={userData.employee ? userData.employee.firstName : ""}
                            validation={{
                                required:
                                    {
                                        value: true,
                                        message: "Field is required",
                                    }
                            }
                            }
                        />
                        <FormInputField
                            label="Preposition"
                            name="preposition"
                            type="text"
                            id="preposition"
                            register={register}
                            errors={errors}
                            defaultValue={userData.employee ? userData.employee.preposition : ""}

                        />
                        <FormInputField
                            label="Last name"
                            name="lastName"
                            type="text"
                            id="lastName"
                            register={register}
                            errors={errors}
                            defaultValue={userData.employee ? userData.employee.lastName : ""}
                            validation={{
                                required:
                                    {
                                        value: true,
                                        message: "Field is required",
                                    }
                            }
                            }
                        />
                        <FormInputField
                            label="Short name"
                            name="shortName"
                            type="text"
                            id="shortName"
                            register={register}
                            errors={errors}
                            defaultValue={userData.employee ? userData.employee.shortName : ""}
                            validation={{
                                required:
                                    {
                                        value: true,
                                        message: "Field is required",
                                    }
                            }
                            }
                        />
                        <FormInputField
                            label="Date of Birth"
                            name="dob"
                            type="date"
                            id="dob"
                            register={register}
                            errors={errors}
                            defaultValue={userData.employee ? userData.employee.dob : ""}
                        />
                        <FormInputField
                            label="Phone number"
                            name="phoneNumber"
                            type="text"
                            id="phoneNumber"
                            register={register}
                            errors={errors}
                            defaultValue={userData.employee ? userData.employee.phoneNumber : ""}
                        />
                        <FormInputField
                            label="Team"
                            name="teamName"
                            type="text"
                            id="teamName"
                            register={register}
                            errors={errors}
                            defaultValue={userData.employee ? userData.team.teamName : ""}
                            validation={{
                                required:
                                    {
                                        value: true,
                                        message: "Field is required",
                                    }
                            }
                            }
                        />
                        <FormInputField
                            label="Employee Active"
                            name="isEmpActive"
                            type="checkbox"
                            id="isEmpActive"
                            register={register}
                            errors={errors}
                        />

                        {/*    <Checkbox*/}
                        {/*        label="Employee Active"*/}
                        {/*        name="isActive"*/}
                        {/*        checked={isActive}*/}
                        {/*        onChange={handleIsActiveChange}*/}
                        {/*    />*/}

                        {/*    <Button type="submit" children="Opslaan"/>*/}
                        {/*</form>*/}
                    </form>
                </div>
            </div>
        </main>
    );
}


export default SingleUser;