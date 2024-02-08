import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {getUser, updateEmployee, updateUser} from "../../service";
import {AuthContext} from "../../context/AuthContext";
import {errorHandler} from "../../helpers/errorHandler";
import FormInputField from "../../components/FormInputField/FormInputField";
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import {LocaleContext} from "../../context/LocaleContext";


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
    const userLocale = useContext(LocaleContext)



    const handleFormSubmitUser = async (formData) => {
        try {
            console.log(formData)
            await updateUser(token, formData.username, formData.password, formData.userRole, formData.email, formData.isDeleted)
        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
            console.error(e)

        }

    };

    const handleFormSubmitEmployee = async (formData) => {
        try {
            console.log(formData)
            await updateEmployee(token, formData.id, formData.firstName, formData.preposition, formData.lastName, formData.shortName, formData.dob, formData.isEmpActive, formData.teamName, formData.username)

        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
            console.error(e)
        }

    };

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
                    setValue('isEmpActive', user.employee?.isActive)
                    setValue('isDeleted', user.isDeleted)

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
                    <form onSubmit={handleSubmit(handleFormSubmitUser)}>
                        <h3>User</h3>
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
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
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
                            validation={{
                                required:
                                    {
                                        value: false,
                                        message: "Field is required",
                                    }, pattern: {
                                    value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()\[\]{}:;',?/*~$^+=<>]).{8,20}$/,
                                    message: "1. Password must contain at least one digit [0-9]. " +
                                        "2. Password must contain at least one lowercase Latin character [a-z]. " +
                                        "3. Password must contain at least one uppercase Latin character [A-Z]." +
                                        "4. Password must contain at least one special character.\n" +
                                        "5. Password must contain a length of at least 8 characters and a maximum of 20 characters."
                                }
                            }
                            }
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

                    <form onSubmit={handleSubmit(handleFormSubmitEmployee)}>
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
                        <Button type="submit" children="Opslaan"/>
                    </form>
                    <div className="screen-container">
                        <div className="shifts-container">
                            SHIFTS
                            {userData.shifts ? userData.shifts.slice(0, 5).map((shift) => {

                                const startShiftDate = new Date(shift.startShift);
                                const endShiftDate = new Date(shift.endShift);


                                const date = `${startShiftDate.getDate().toString().padStart(2, '0')}-${(startShiftDate.getMonth() + 1).toString().padStart(2, '0')}-${startShiftDate.getFullYear()}`;
                                const startTime = startShiftDate.toLocaleTimeString(userLocale, {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });
                                const endTime = endShiftDate.toLocaleTimeString(userLocale, {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });
                                return <p key={shift.id}>{date} {startTime} - {endTime}</p>
                            }) : "No Shifts Available"}
                        </div>


                        <div className="absences-container">
                            ABSENCES
                            {userData.absences ? userData.absences.slice(0, 5).map((absence) => {

                                const startAbsenceDate = new Date(absence.startDate);
                                const endAbsenceDate = new Date(absence.endDate);

                                const startDate = `${startAbsenceDate.getDate().toString().padStart(2, '0')}-${(startAbsenceDate.getMonth() + 1).toString().padStart(2, '0')}-${startAbsenceDate.getFullYear()}`;
                                const endDate = `${endAbsenceDate.getDate().toString().padStart(2, '0')}-${(endAbsenceDate.getMonth() + 1).toString().padStart(2, '0')}-${endAbsenceDate.getFullYear()}`;

                                return <p key={absence.id}>{startDate} {endDate}</p>
                            }) : "No Absences Available"
                            }
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}


export default SingleUser;