import React, {useContext, useEffect, useState} from 'react';
import {createEmployee, createUser, getSelf, getUserData, updateEmployee, updateUser} from "../../service";
import FormInputField from "../../components/FormInputField/FormInputField";
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import Checkbox from "../../components/checkbox/Checkbox";
import {errorHandler} from "../../helpers/errorHandler";
import {LocaleContext} from "../../context/LocaleContext";
import "./Profile.css"
import {useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";

function Profile() {
    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onTouched"})
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const [isDeleted, setIsDeleted] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const userLocale = useContext(LocaleContext)
    // const [profileData, setProfileData] = useState(null);
    const {username} = useParams();
    // const [token, setToken] = useState("")
    const {token} = useContext(AuthContext);

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            try {
                const data = username ? await getUserData(token, username) : await getSelf(token);
                setProfileData(data);
                if (data.shifts) {
                    data.shifts.sort((a, b) => new Date(a.startShift) - new Date(b.startShift));
                }
                if (data.absences) {
                    data.absences.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                }
            } catch (e) {
                setError(true);
                setErrormessage(errorHandler(e));
            } finally {
                setLoading(false);
            }
        };

        void fetchData();
    }, []);

    useEffect(() => {
        if (profileData) {
            setIsDeleted(profileData.isDeleted);
            if (profileData.employee) {
                setIsActive(profileData.employee.isActive)
            }
        }
    }, [profileData]);

    const handleIsDeletedChange = (event) => {
        setIsDeleted(!event.target.checked);
    };

    const handleIsActiveChange = (event) => {
        setIsActive(event.target.checked);
    };

    const handleFormSubmitUser = async (formData) => {
        try {
            await updateUser(token, formData.username, formData.password, formData.userRole, formData.email, isDeleted)
        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
        }

    };

    const handleFormSubmitEmployee = async (formData) => {

        try {
            await updateEmployee(token, formData.id, formData.firstName, formData.preposition, formData.lastName, formData.shortName, formData.dob, isActive, formData.teamName, formData.username)
        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
        }

    };

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (

        <main className="outer-container">
            <div className="inner-container">
                {error ? <p>{errorMessage}</p> :
                    <div className="profile-container">
                        <div className="form-outer-container">
                            <form onSubmit={handleSubmit(handleFormSubmitUser)} className="form-inner-container">
                                <h3>User</h3>
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
                                    errors={errors}
                                    defaultValue={profileData ? profileData.email : ""}
                                    validation={{
                                        required:
                                            {
                                                value: true,
                                                message: "Field is required",
                                            } , pattern: {
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
                                <Checkbox
                                    label="User Active"
                                    name="isDeleted"
                                    checked={!isDeleted}
                                    onChange={handleIsDeletedChange}
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
                                    defaultValue={profileData.employee ? profileData.employee.preposition : ""}

                                />
                                <FormInputField
                                    label="Last name"
                                    name="lastName"
                                    type="text"
                                    id="lastName"
                                    register={register}
                                    errors={errors}
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
                                    defaultValue={profileData.employee ? profileData.employee.dob : ""}
                                />
                                <FormInputField
                                    label="Phone number"
                                    name="phoneNumber"
                                    type="text"
                                    id="phoneNumber"
                                    register={register}
                                    errors={errors}
                                    defaultValue={profileData.employee ? profileData.employee.phoneNumber : ""}
                                />
                                <FormInputField
                                    label="Team"
                                    name="teamName"
                                    type="text"
                                    id="teamName"
                                    register={register}
                                    errors={errors}
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
                                <Checkbox
                                    label="Employee Active"
                                    name="isActive"
                                    checked={isActive}
                                    onChange={handleIsActiveChange}
                                />

                                <Button type="submit" children="Opslaan"/>
                            </form>
                        </div>

                        <div className="screen-container">
                            <div className="shifts-container">
                                SHIFTS
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
                                ABSENCES
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
                    </div>}
            </div>
        </main>

    );
}

export default Profile;

