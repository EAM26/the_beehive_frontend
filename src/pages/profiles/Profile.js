import React, {useContext, useEffect, useState} from 'react';
import {getUserData, getSelf} from "../../service";
import FormInputField from "../../components/FormInputField/FormInputField";
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import Checkbox from "../../components/checkbox/Checkbox";
import {errorHandler} from "../../helpers/errorHandler";
import {LocaleContext} from "../../context/LocaleContext";
import "./Profile.css"
import {useParams} from "react-router-dom";

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
    const { username } = useParams();

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchSelfData = async () => {
            setLoading(true);
            try {
                const data = username ? await getUserData(token, username) : await getSelf(token);
                setProfileData(data);
            } catch (e) {
                setError(true);
                setErrormessage(errorHandler(e));
            } finally {
                setLoading(false);
            }
        };

        void fetchSelfData();
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

    const handleFormSubmitUser = (formData) => {
        const dataToSubmit = {
            ...formData, isDeleted,
            isActive,
        };
        console.log("Form Data:", dataToSubmit);
    };

    if (!profileData) {
        return <div>Loading...</div>;
    }


    return (

        <main>
            {error ? <p>{errorMessage}</p> :
                <div>
                    <form
                        onSubmit={handleSubmit(handleFormSubmitUser)}>

                        {/*USER DATA*/}
                        <FormInputField
                            label="User name"
                            name="username"
                            type="text"
                            id="username"
                            register={register}
                            errors={errors}
                            defaultValue={profileData ? profileData.username : ""}
                        />
                        <FormInputField
                            label="Email"
                            name="email"
                            type="email"
                            id="email"
                            register={register}
                            errors={errors}
                            defaultValue={profileData ? profileData.email : ""}
                        />
                        <Checkbox
                            label="User Not Deleted"
                            name="isDeleted"
                            checked={!isDeleted}
                            onChange={handleIsDeletedChange}
                        />

                        {/*Employee Data*/}
                        <FormInputField
                            label="Employee id"
                            name="empId"
                            type="text"
                            id="empId"
                            register={register}
                            errors={errors}
                            defaultValue={profileData.employee ? profileData.employee.id : ""}
                        />
                        <Checkbox
                            label="Employee Active"
                            name="isActive"
                            checked={isActive}
                            onChange={handleIsActiveChange}
                        />
                        <FormInputField
                            label="First Name"
                            name="firstName"
                            type="text"
                            id="firstName"
                            register={register}
                            errors={errors}
                            defaultValue={profileData.employee ? profileData.employee.firstName : ""}
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
                        />
                        <FormInputField
                            label="Short name"
                            name="shortName"
                            type="text"
                            id="shortName"
                            register={register}
                            errors={errors}
                            defaultValue={profileData.employee ? profileData.employee.shortName : ""}
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
                            label="Employee id"
                            name="empId"
                            type="text"
                            id="empId"
                            register={register}
                            errors={errors}
                            defaultValue={profileData.employee ? profileData.employee.id : ""}
                        />
                        <Button type="submit" children="Opslaan"/>
                    </form>

                    <div>
                        SHIFTS
                        <div className="shifts-container">
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

                                // Return the formatted string
                                return <p key={shift.id}>{date} {startTime} - {endTime}</p>
                            }) : "No Shifts Available"}
                        </div>
                    </div>
                    <div>
                        ABSENCES
                        <div className="absences-container">
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
        </main>

    );
}

export default Profile;

