import React, {useContext, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {
    createAbsence,
    createCopyId,
    deleteAbsence,
    getCopyId,
    getUser,
    updateEmployee,
    updateUser
} from "../../service";
import {AuthContext} from "../../context/AuthContext";
import {errorHandler} from "../../helpers/errorHandler";
import FormInputField from "../../components/FormInputField/FormInputField";
import {useForm} from "react-hook-form";
import Button from "../../components/button/Button";
import {LocaleContext} from "../../context/LocaleContext";
import "./SingleUser_Profile.css"
import BaseModal from "../../components/baseModal/BaseModal";
import {PlusCircle, Trash} from "@phosphor-icons/react";


function SingleUser() {
    const {register, reset, handleSubmit, formState: {errors}, setValue} = useForm({
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
    const [modifiedUserFields, setModifiedUserFields] = useState({})
    const [modifiedEmployeeFields, setModifiedEmployeeFields] = useState({})
    const [toggleFetchData, setToggleFetchData] = useState(false)
    const [showAbsenceModal, setShowAbsenceModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null)

    const navigate = useNavigate();
    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleDownloadId = async () => {
        setLoading(true);
        setError(false);
        setErrormessage("");
        try {
            await getCopyId(token, userData.employee.id)
        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
            console.error(e)
        } finally {
            setLoading(false);
        }
    }

    const handleUploadId = async (e) => {
        e.preventDefault();
        if (selectedFile.type !== "application/pdf") {
            setError(true);
            setErrormessage("Only pdf files allowed.");
        } else {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setLoading(true);
            setError(false);
            setErrormessage("");

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('employeeId', userData.employee.id);
            try {
                await createCopyId(token, formData)
                setToggleFetchData(!toggleFetchData)
            } catch (e) {
                setError(true);
                setErrormessage(errorHandler(e));
                console.error(e)
            } finally {
                setLoading(false);
            }
        }

    }

    const handleClose = () => {
        setShowAbsenceModal(false)
    }

    const handleNewAbsenceClick = () => {
        setShowAbsenceModal(true)
    }
    const handleSubmitAbsence = async (newAbsence) => {
        setLoading(true);
        setError(false);
        setErrormessage("");
        try {
            await createAbsence(token, newAbsence.startDate, newAbsence.endDate, userData.employee.id)
            setToggleFetchData(!toggleFetchData);
            reset();
            setShowAbsenceModal(false)
        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
            console.error(e)
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteAbsence = async (absenceId) => {
        setLoading(true);
        setError(false);
        setErrormessage("");
        try {
            await deleteAbsence(token, absenceId)
            setToggleFetchData(!toggleFetchData);
        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
            console.error(e)
        } finally {
            setLoading(false);
        }


    }

    const handleFormSubmitUser = async (formData) => {
        setLoading(true);
        setError(false);
        setErrormessage("");
        try {

            await updateUser(token, formData.username, formData.password, formData.userRole, formData.email, formData.isDeleted)
            setModifiedUserFields({})

        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
            console.error(e)
        } finally {
            reset({ password: "" });
            setLoading(false)
        }

    };

    const handleUserOnInput = (fieldName) => () => {
        setModifiedUserFields(prevState => ({...prevState, [fieldName]: true}));

    }

    const handleFormSubmitEmployee = async (formData) => {
        setLoading(true);
        setError(false);
        setErrormessage("");
        try {
            await updateEmployee(token, formData.id, formData.firstName, formData.preposition, formData.lastName, formData.shortName, formData.dob, formData.isEmpActive, formData.phoneNumber, formData.teamName, formData.username)
            setModifiedEmployeeFields({})
        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
            console.error(e)
        } finally {
            setLoading(false);
        }

    };

    const handleEmployeeOnInput = (fieldName) => () => {
        setModifiedEmployeeFields(prevState => ({...prevState, [fieldName]: true}));

    }

    useEffect(() => {
            const fetchData = async () => {
                setLoading(true);
                setError(false);
                setErrormessage("");
                try {
                    const user = await getUser(token, username);
                    if (user.shifts) {
                        user.shifts.sort((a, b) => new Date(a.startShift) - new Date(b.startShift));
                    }
                    if (user.absences) {
                        user.absences.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                    }

                    setValue('isEmpActive', user.employee?.isActive)
                    setValue('isDeleted', user.isDeleted)
                    setUserData(user);
                } catch (e) {
                    setError(true);
                    setErrormessage(errorHandler(e))
                    navigate('/404')
                } finally {
                    setLoading(false);
                }

            };

            void fetchData();

        },
        [toggleFetchData]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <main className="outer-container">
            <div className="inner-container">
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{errorMessage}</p>}
                <div className="single-user-page">
                    <div className="user-emp">
                        <form
                            className="user-data"
                            onSubmit={handleSubmit(handleFormSubmitUser)}>
                            <h3>USER</h3>
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
                                onInput={handleUserOnInput('email')}
                                className={modifiedUserFields.email ? 'modified' : ''}
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
                                onInput={handleUserOnInput('password')}
                                className={modifiedUserFields.password ? 'modified' : ''}
                                errors={errors}
                            />
                            <FormInputField
                                label="Authority"
                                name="userRole"
                                type="text"
                                id="userRole"
                                register={register}
                                onInput={handleUserOnInput('userRole')}
                                className={modifiedUserFields.userRole ? 'modified' : ''}
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
                            <Button className="btn-blue" type="submit" children="Save"/>
                        </form>
                        {userData.employee ?

                            <form
                                onSubmit={handleSubmit(handleFormSubmitEmployee)}>
                                <h3>EMPLOYEE</h3>
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
                                    onInput={handleEmployeeOnInput('firstName')}
                                    className={modifiedEmployeeFields.firstName ? 'modified' : ''}
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
                                    onInput={handleEmployeeOnInput('preposition')}
                                    className={modifiedEmployeeFields.preposition ? 'modified' : ''}
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
                                    onInput={handleEmployeeOnInput('lastName')}
                                    className={modifiedEmployeeFields.lastName ? 'modified' : ''}
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
                                    onInput={handleEmployeeOnInput('shortName')}
                                    className={modifiedEmployeeFields.shortName ? 'modified' : ''}
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
                                    onInput={handleEmployeeOnInput('dob')}
                                    className={modifiedEmployeeFields.dob ? 'modified' : ''}
                                    errors={errors}
                                    defaultValue={userData.employee ? userData.employee.dob : ""}
                                />
                                <FormInputField
                                    label="Phone number"
                                    name="phoneNumber"
                                    type="text"
                                    id="phoneNumber"
                                    register={register}
                                    onInput={handleEmployeeOnInput('phoneNumber')}
                                    className={modifiedEmployeeFields.phoneNumber ? 'modified' : ''}
                                    errors={errors}
                                    defaultValue={userData.employee ? userData.employee.phoneNumber : ""}
                                    validation={{
                                        required:
                                            {
                                                value: false,
                                            }, pattern: {
                                            value: /^\d+$/,
                                            message: "Phone number can only contain numbers"
                                        }
                                    }
                                    }
                                />
                                <FormInputField
                                    label="Team"
                                    name="teamName"
                                    type="text"
                                    id="teamName"
                                    register={register}
                                    onInput={handleEmployeeOnInput('teamName')}
                                    className={modifiedEmployeeFields.teamName ? 'modified' : ''}
                                    errors={errors}
                                    defaultValue={userData.employee ? userData.team.teamName : ""}
                                    readOnly={true}
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
                                <Button className="btn-blue" type="submit" children="Save"/>
                            </form>

                            : null}
                    </div>
                    {userData.employee ?
                        <form
                            className="image-item"
                            onSubmit={handleUploadId}>
                            <label htmlFor="copyId">Copy id-card</label>

                            <input
                                id="copyId"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            {userData.employee.imageData &&
                                <Button
                                    className="btn-blue" type="button" children="Download"
                                    onClick={handleDownloadId}/>}
                            <Button className="btn-blue" type="submit" children="Upload"/>
                        </form>
                        : null}
                    {userData.employee ?
                        <div className="shifts-absences">
                            <div className="shifts-container">
                                <h3 className="shifts-head">SHIFTS</h3>
                                <div className="shift-item">
                                {userData.shifts && userData.shifts.length > 0 ? userData.shifts.slice(0, 5).map((shift) => {

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
                            </div>

                            <div className="absences-container">
                                <div className="absence-head">
                                    <h3>ABSENCES</h3>
                                    <Button className="btn-logo btn-plus" type="button"
                                            children={<PlusCircle size={20}/>}
                                            onClick={() => handleNewAbsenceClick(userData.employee.id)}/>
                                </div>
                                {showAbsenceModal && (
                                    <BaseModal
                                        onClose={handleClose}
                                        isOpen={showAbsenceModal}>
                                        <div className="modal">
                                            <div className="modal-content">
                                                <form onSubmit={handleSubmit(handleSubmitAbsence)}>
                                                    {error && <p className="error-message">{errorMessage}</p>}
                                                    <FormInputField
                                                        className="modal-item"
                                                        label="Start date"
                                                        type="date"
                                                        name="startDate"
                                                        id="startDate"
                                                        errors={errors}
                                                        register={register}
                                                        validation={{required: "Field is required"}}
                                                    />
                                                    <FormInputField
                                                        className="modal-item"
                                                        label="End date"
                                                        type="date"
                                                        name="endDate"
                                                        id="endDate"
                                                        errors={errors}
                                                        register={register}
                                                        validation={{required: "Field is required"}}
                                                    />
                                                    <div className="modal-button-row">
                                                        <Button className="btn-blue" type="submit">Create</Button>
                                                        <Button className="btn-blue" type="button"
                                                                onClick={handleClose}>Cancel</Button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </BaseModal>)}

                                {userData.absences && userData.absences.length > 0 ? userData.absences.map((absence) => {

                                    const startAbsenceDate = new Date(absence.startDate);
                                    const endAbsenceDate = new Date(absence.endDate);

                                    const startDate = `${startAbsenceDate.getDate().toString().padStart(2, '0')}-${(startAbsenceDate.getMonth() + 1).toString().padStart(2, '0')}-${startAbsenceDate.getFullYear()}`;
                                    const endDate = `${endAbsenceDate.getDate().toString().padStart(2, '0')}-${(endAbsenceDate.getMonth() + 1).toString().padStart(2, '0')}-${endAbsenceDate.getFullYear()}`;

                                    return <div className="absence-item"  key={absence.id}>
                                        <p>{startDate} {endDate} </p>
                                        <Button
                                            className="btn-logo"
                                            type="button"
                                            children={<Trash size={20}/>}
                                            onClick={() => handleDeleteAbsence(absence.id)}/>

                                    </div>
                                }) : "No Absences Available"
                                }
                            </div>
                        </div>
                        : null}
                </div>
            </div>
        </main>
    );
}


export default SingleUser;