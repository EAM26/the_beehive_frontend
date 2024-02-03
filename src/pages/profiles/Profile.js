import React, {useEffect, useState} from 'react';
import {getSelf} from "../../service";
import FormInputField from "../../components/FormInputField/FormInputField";
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import Checkbox from "../../components/checkbox/Checkbox";
import {errorHandler} from "../../helpers/errorHandler";
import "./Profile.css"

function Profile() {
    const {register, handleSubmit, formState: {errors}} = useForm({mode: "onTouched"})
    const [self, setSelf] = useState(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const [isDeleted, setIsDeleted] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [shifts, setShifts] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchSelfData = async () => {
            try {
                const selfData = await getSelf(token);
                setSelf(selfData);
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
        if (self) {
            setIsDeleted(self.isDeleted);
            if (self.employee) {
                setIsActive(self.employee.isActive)
                // setShifts(self.employee.shifts)
            }
        }
    }, [self]);

    const handleIsDeletedChange = (event) => {
        setIsDeleted(!event.target.checked);
    };

    const handleIsActiveChange = (event) => {
        setIsActive(event.target.checked);
    };

    const handleFormSubmitUser = (formData) => {
        const dataToSubmit = {
            ...formData, isDeleted, // add isDeleted to the formData
            isActive, // add isActive to the formData
        };
        console.log("Form Data:", dataToSubmit);
        // Here you would send the dataToSubmit to the server
    };

    if (!self) {
        return <div>Loading...</div>;
    }
    // if (self && self.employee) {
    //     console.log('Type of shifts:', typeof self.employee.shifts);
    //     console.log('Is shifts an array:', Array.isArray(self.employee.shifts));
    // }


    return (

        <main>
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
                    defaultValue={self ? self.username : ""}
                />
                <FormInputField
                    label="Email"
                    name="email"
                    type="email"
                    id="email"
                    register={register}
                    errors={errors}
                    defaultValue={self ? self.email : ""}
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
                    defaultValue={self.employee ? self.employee.id : ""}
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
                    defaultValue={self.employee ? self.employee.firstName : ""}
                />
                <FormInputField
                    label="Preposition"
                    name="preposition"
                    type="text"
                    id="preposition"
                    register={register}
                    errors={errors}
                    defaultValue={self.employee ? self.employee.preposition : ""}
                />
                <FormInputField
                    label="Last name"
                    name="lastName"
                    type="text"
                    id="lastName"
                    register={register}
                    errors={errors}
                    defaultValue={self.employee ? self.employee.lastName : ""}
                />
                <FormInputField
                    label="Short name"
                    name="shortName"
                    type="text"
                    id="shortName"
                    register={register}
                    errors={errors}
                    defaultValue={self.employee ? self.employee.shortName : ""}
                />
                <FormInputField
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    id="dob"
                    register={register}
                    errors={errors}
                    defaultValue={self.employee ? self.employee.dob : ""}
                />
                <FormInputField
                    label="Phone number"
                    name="phoneNumber"
                    type="text"
                    id="phoneNumber"
                    register={register}
                    errors={errors}
                    defaultValue={self.employee ? self.employee.phoneNumber : ""}
                />
                <FormInputField
                    label="Employee id"
                    name="empId"
                    type="text"
                    id="empId"
                    register={register}
                    errors={errors}
                    defaultValue={self.employee ? self.employee.id : ""}
                />
                <Button type="submit" children="Opslaan"/>
            </form>

            <div>
                SHIFTS
                <div className="shifts-container">
                    {self.shifts ? self.shifts.slice(0, 5).map((shift) => {
                        // Create Date objects from the startShift and endShift strings
                        const startShiftDate = new Date(shift.startShift);
                        const endShiftDate = new Date(shift.endShift);

                        // Get the user's locale from the browser
                        const userLocale = navigator.language;

                        // Format the dates and times
                        const date = startShiftDate.toLocaleDateString(userLocale); // Local format for day-month-year
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
                    }) : "No Shifts Available"
                    }
                </div>
            </div>

        </main>

    );
}

export default Profile;

