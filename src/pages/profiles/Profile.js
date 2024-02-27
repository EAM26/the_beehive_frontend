import React, {useContext, useEffect, useState} from 'react';
import {getSelf, updateEmployee, updateUser, updateUserAsSelf} from "../../service";
import FormInputField from "../../components/FormInputField/FormInputField";
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import {errorHandler} from "../../helpers/errorHandler";
import {LocaleContext} from "../../context/LocaleContext";
import "../users/SingleUser_Profile.css"
import {AuthContext} from "../../context/AuthContext";

function Profile() {
    const {register, handleSubmit, formState: {errors}, setValue} = useForm({
        mode: "onTouched",
        defaultValues: {
            isDeleted: false,
            isEmpActive: false,
        }
    })
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const [modifiedUserFields, setModifiedUserFields] = useState({})
    const userLocale = useContext(LocaleContext)
    const {token} = useContext(AuthContext);

    const handleFormSubmitUser = async (formData) => {
        try {
            await updateUserAsSelf(token, formData.username, formData.password, formData.userRole, formData.email, formData.isDeleted)
            setModifiedUserFields({})
        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
            console.error(e)

        }
    };

    const handleOnInput = (fieldName) => (event) => {
        setModifiedUserFields(prevState => ({ ...prevState, [fieldName]: true }));

    }



    useEffect(() => {

        const controller = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            try {
                const user =  await getSelf(token);

                setValue('isEmpActive', user.employee?.isActive)
                setValue('isDeleted', user.isDeleted)

                if (user.shifts) {
                    user.shifts.sort((a, b) => new Date(a.startShift) - new Date(b.startShift));
                }
                if (user.absences) {
                    user.absences.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                }
                setProfileData(user);
            } catch (e) {
                setError(true);
                setErrormessage(errorHandler(e));
                console.error(e)
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
        return function cleanup() {
            controller.abort();
        }
    }, []);
    console.log(profileData)

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <main className="outer-container" >
            <div className="inner-container">
                <div className="form-outer-container">
                    <div className="form-inner-container">
                    <form onSubmit={handleSubmit(handleFormSubmitUser)}>
                        <h3>USER</h3>
                        <FormInputField
                            label="User name"
                            name="username"
                            type="text"
                            id="username"
                            register={register}
                            errors={errors}
                            defaultValue={profileData ? profileData.username : ""}
                            readOnly={true}
                        />
                        <FormInputField
                            label="Email"
                            name="email"
                            type="email"
                            id="email"
                            register={register}
                            onInput={handleOnInput('email')}
                            className={modifiedUserFields.email ? 'modified': ''}
                            errors={errors}
                            defaultValue={profileData ? profileData.email : ""}
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
                            onInput={handleOnInput('password')}
                            className={modifiedUserFields.password? 'modified': ''}
                            validation={{
                                required:
                                    {
                                        value: false,
                                    }, pattern: {
                                    value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()[\]{}:;',?/*~$^+=<>]).{8,20}$/,
                                    message: "1. Password must contain at least one digit [0-9]. " +
                                        "2. Password must contain at least one lowercase Latin character [a-z]. " +
                                        "3. Password must contain at least one uppercase Latin character [A-Z]." +
                                        "4. Password must contain at least one special character." +
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
                            readOnly={true}
                            defaultValue={profileData ? profileData.authorities[0].authority.replace('ROLE_', '') : ""}
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
                            disabled={true}
                        />
                        <Button type="submit" children="Save"/>
                    </form>
                    <form>
                        <h3>EMPLOYEE</h3>
                        <FormInputField
                            label="Employee id"
                            name="id"
                            type="number"
                            id="id"
                            register={register}
                            errors={errors}
                            defaultValue={profileData.employee ? profileData.employee.id : ""}
                            readOnly={true}
                        />


                        <FormInputField
                            label="First Name"
                            name="firstName"
                            type="text"
                            id="firstName"
                            register={register}
                            errors={errors}
                            readOnly={true}
                            defaultValue={profileData.employee ? profileData.employee.firstName : ""}
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
                            readOnly={true}
                            defaultValue={profileData.employee ? profileData.employee.preposition : ""}
                        />
                        <FormInputField
                            label="Last name"
                            name="lastName"
                            type="text"
                            id="lastName"
                            register={register}
                            errors={errors}
                            readOnly={true}
                            defaultValue={profileData.employee ? profileData.employee.lastName : ""}
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
                            readOnly={true}
                            defaultValue={profileData.employee ? profileData.employee.shortName : ""}
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
                            readOnly={true}
                            defaultValue={profileData.employee ? profileData.employee.dob : ""}
                        />
                        <FormInputField
                            label="Phone number"
                            name="phoneNumber"
                            type="text"
                            id="phoneNumber"
                            register={register}
                            errors={errors}
                            readOnly={true}
                            defaultValue={profileData.employee ? profileData.employee.phoneNumber : ""}
                        />
                        <FormInputField
                            label="Team"
                            name="teamName"
                            type="text"
                            id="teamName"
                            register={register}
                            errors={errors}
                            readOnly={true}
                            defaultValue={profileData.employee ? profileData.team.teamName : ""}
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
                            disabled={true}
                        />
                    </form>
                    </div>
                    <div className="form-inner-container">
                        <div className="shifts-container">
                            <h3>SHIFTS</h3>
                            {profileData.shifts ? profileData.shifts.slice(0, 5).map((shift) => {

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
                            <h3>ABSENCES</h3>
                            {profileData.absences ? profileData.absences.slice(0, 5).map((absence) => {

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

export default Profile;

