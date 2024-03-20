import React, {useContext, useEffect, useState} from 'react';
import {errorHandler} from "../../helpers/errorHandler";
import {createEmployee, createUser, getTeams, getUser, getUsers} from "../../service";
import Button from "../../components/button/Button";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import BaseModal from "../../components/baseModal/BaseModal";
import FormInputField from "../../components/FormInputField/FormInputField";
import {useForm} from "react-hook-form";
import './Users.css';
import {Eye, PlusCircle, UserCirclePlus} from "@phosphor-icons/react";


function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const navigate = useNavigate();
    const [showUserModal, setShowUserModal] = useState(false);
    const {token} = useContext(AuthContext);
    const [showEmployeeModal, setShowEmployeeModal] = useState(false);
    const [selectedUsername, setSelectedUsername] = useState('');
    const [deletedFilter, setDeletedFilter] = useState('all');
    const [employeeFilter, setEmployeeFilter] = useState('all');
    const [teams, setTeams] = useState([]);
    const {register, reset, handleSubmit, formState: {errors},} = useForm({
        defaultValues: {
            isActive: true
        }
    })

    const teamOptions = teams.map(team => ({
        value: team.teamName,
        label: team.teamName
    }));


    // filter options
    const handleDeletedFilterChange = (e) => {
        setDeletedFilter(e.target.value);
    };

    const handleEmployeeFilterChange = (e) => {
        setEmployeeFilter(e.target.value);
    };

    // User functions
    const handleViewUser = (username) => {
        navigate(`/users/${username}`);
    };

    const handleNewUserClick = () => {
        setShowUserModal(true);
    };

    const handleSubmitUser = async (formDataUser) => {
        setLoading(true);
        setError(false);
        setErrormessage("");
        try {
            const id = await createUser(token, formDataUser.username, formDataUser.password, formDataUser.userRole, formDataUser.email, formDataUser.isDeleted)
            const newUser = await getUser(token, id);
            setUsers(currentUsers => [...currentUsers, newUser]);
            const updatedUsers = [...users, newUser];
            setUsers(updatedUsers.sort((a, b) => a.username.localeCompare(b.username)));
            reset();
            setShowUserModal(false)

        } catch (e) {
            console.error(e)
            setError(true);
            setErrormessage(errorHandler(e));
        } finally {
            setLoading(false);
        }
    };


    // Employee functions
    const handleNewEmployeeClick = (username) => {
        setSelectedUsername(username);
        setShowEmployeeModal(true)
    }

    const handleSubmitEmployee = async (formDataEmployee) => {
        setLoading(true);
        setError(false);
        setErrormessage("");
        try {
            const newEmployee = await createEmployee(token, formDataEmployee.firstName, formDataEmployee.preposition, formDataEmployee.lastName, formDataEmployee.shortName, formDataEmployee.dob, formDataEmployee.isActive, formDataEmployee.phoneNumber, formDataEmployee.teamName, selectedUsername)
            setUsers(currentUsers => {
                return currentUsers.map(user => {
                    if (user.username === selectedUsername) {
                        return {
                            ...user,
                            employee: {...newEmployee}
                        };
                    }
                    return user;
                });
            });
            reset()
            setShowEmployeeModal(false);
        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
            console.error(e)
        } finally {
            setLoading(false);
        }


    }


    const handleCloseModal = () => {
        setShowUserModal(false);
        setShowEmployeeModal(false);
        setSelectedUsername('')
    };

    useEffect(() => {
        const fetchTeamsData = (async () => {
            setLoading(true)
            try {
                const response = await getTeams(token);
                setTeams(response);
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }

        })
        void fetchTeamsData();
    }, []);


    useEffect(() => {
        console.log("use effect userData")
        const controller = new AbortController();

        const fetchData = async () => {
            setLoading(true);
            setError(false);
            setErrormessage("");
            try {
                let usersData = await getUsers(token, controller.signal);

                if (deletedFilter !== 'all') {
                    const filterValue = deletedFilter === 'deleted';
                    usersData = usersData.filter(user => user.isDeleted === filterValue);
                }

                if (employeeFilter === 'isEmployee') {
                    usersData = usersData.filter(user => user.employee);
                } else if (employeeFilter === 'userOnly') {
                    usersData = usersData.filter(user => !user.employee);
                }

                setUsers(usersData);

            } catch (e) {
                setError(true);
                setErrormessage(errorHandler(e));
            } finally {
                setLoading(false);
            }
        };
        void fetchData();

        return function cleanup() {
            controller.abort();
        }
    }, [deletedFilter, employeeFilter]);


    return (
        <main className="outer-container">
            <div className="inner-container">
                {loading && <p>Loading...</p>}
                <p className="error-message">{error ? errorMessage : ""}</p>
                <div className="users-page">
                    <div className="users-head">
                        <h2>Users</h2>
                        <Button className="btn-new btn-blue" type="button" onClick={handleNewUserClick}>
                            <p>new</p>
                            <PlusCircle size={20}/>
                        </Button>
                    </div>
                    <div className="users-select">
                        <span>User Status</span>
                        <select value={deletedFilter} onChange={handleDeletedFilterChange}>
                            <option value="all">All</option>
                            <option value="active">Not Deleted</option>
                            <option value="deleted">Deleted</option>
                        </select>

                        <span>Employee</span>
                        <select value={employeeFilter} onChange={handleEmployeeFilterChange}>
                            <option value="all">All</option>
                            <option value="isEmployee">Employees</option>
                            <option value="userOnly">Non Employees</option>
                        </select>
                    </div>
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Full Name</th>
                            <th>Status</th>
                            <th>Email</th>
                            <th>Authority</th>
                            <th>Emp. id</th>

                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => {
                                const authoritiesDisplay = user.authorities.map(auth => auth.authority.replace('ROLE_', '')).join(', ')
                                return <tr key={user.username}>
                                    <td>{user.username}</td>
                                    <td>{user.employee?.firstName} {user.employee?.preposition} {user.employee?.lastName}</td>
                                    <td>{user.isDeleted ? "Not Active" : "Active"}</td>
                                    <td>{user.email} </td>
                                    <td>{authoritiesDisplay}</td>
                                    <td className="td-emp-id">{user.employee ? user.employee.id :
                                        <Button className="btn-logo btn-emp"
                                                children={<UserCirclePlus size={20}/>}
                                                onClick={() => handleNewEmployeeClick(user.username)}
                                        >
                                        </Button>}
                                    </td>
                                    <td className="teams-td-button">
                                        {<Button
                                            className="btn-logo btn-view"
                                            children={<Eye size={20}/>}
                                            onClick={() => handleViewUser(user.username)}>

                                        </Button>
                                        }
                                    </td>
                                </tr>
                            }
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* User Modal */}
            <BaseModal
                isOpen={showUserModal}
                onClose={handleCloseModal}>
                <div className="modal">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit(handleSubmitUser)}>
                            <p className="error-message">{error ? errorMessage : ""}</p>
                            <FormInputField
                                className="modal-item"
                                label="UserName"
                                name="username"
                                type="text"
                                id="username"
                                errors={errors}
                                register={register}
                                validation={{
                                    required: "Field is required",
                                    maxLength: {
                                        value: 20,
                                        message: "Not more than 20 characters"
                                    }
                                }}
                            />
                            <FormInputField
                                className="modal-item"
                                label="Password"
                                name="password"
                                type="password"
                                id="password"
                                errors={errors}
                                register={register}
                                validation={{
                                    required: "Field is required",
                                    pattern: {
                                        value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#&()[\]{}:;',?/*~$^+=<>]).{8,20}$/,
                                        message: "1. Password must contain at least one digit [0-9]. " +
                                            "2. Password must contain at least one lowercase Latin character [a-z]. " +
                                            "3. Password must contain at least one uppercase Latin character [A-Z]." +
                                            "4. Password must contain at least one special character." +
                                            "5. Password must contain a length of at least 8 characters and a maximum of 20 characters."
                                    }
                                }}
                            />

                            <FormInputField
                                className="modal-item"
                                label="Email"
                                name="email"
                                type="email"
                                id="email"
                                errors={errors}
                                register={register}
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
                                className="modal-item"
                                label="Authority"
                                name="userRole"
                                type="text"
                                id="userRole"
                                errors={errors}
                                register={register}
                                validation={{required: "Field is required"}}
                            />

                            <FormInputField
                                className="modal-checkbox"
                                label="Deleted"
                                name="isDeleted"
                                type="checkbox"
                                id="isDeleted"
                                errors={errors}
                                register={register}
                            />
                            <div className="modal-button-row">
                            <Button className="btn-blue" type="submit">Create</Button>
                            <Button className="btn-blue" type="button" onClick={handleCloseModal}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </BaseModal>
            {/*Employee Modal*/}
            <BaseModal
                isOpen={showEmployeeModal}
                onClose={handleCloseModal}
            >
                <div className="modal">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit(handleSubmitEmployee)}>
                            <p className="error-message">{error ? errorMessage : ""}</p>
                            <FormInputField
                                className="modal-item"
                                label="First Name"
                                name="firstName"
                                type="text"
                                id="firstName"
                                errors={errors}
                                register={register}
                                validation={{required: "Field is required"}}
                            />
                            <FormInputField
                                className="modal-item"
                                label="Preposition"
                                name="preposition"
                                type="text"
                                id="preposition"
                                errors={errors}
                                register={register}
                            />
                            <FormInputField
                                className="modal-item"
                                label="Last Name"
                                name="lastName"
                                type="text"
                                id="lastName"
                                errors={errors}
                                register={register}
                                validation={{required: "Field is required"}}
                            />
                            <FormInputField
                                className="modal-item"
                                label="Short Name"
                                name="shortName"
                                type="text"
                                id="shortName"
                                errors={errors}
                                register={register}
                                validation={{required: "Field is required"}}
                            />
                            <FormInputField
                                className="modal-item"
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                id="dob"
                                errors={errors}
                                register={register}
                            />
                            <FormInputField
                                className="modal-item"
                                label="Phone Number"
                                name="phoneNumber"
                                type="text"
                                id="phoneNumber"
                                errors={errors}
                                register={register}
                                validation={{
                                    pattern: {
                                        value: /^\d*$/,
                                        message: "Phone number must contain only digits"
                                    }
                                }}
                            />
                            <FormInputField
                                className="modal-item"
                                label="Team"
                                type="select"
                                name="teamName"
                                id="teamName"
                                options={teamOptions}
                                errors={errors}
                                register={register}
                                validation={{required: "Field is required"}}
                                disabled="diabled"
                                selected="selected"
                                defaultName="team"
                            />
                            <FormInputField
                                className="modal-checkbox"
                                label="Active"
                                name="isActive"
                                type="checkbox"
                                id="isActive"
                                errors={errors}
                                register={register}
                                defaultValue={true}
                            />
                            <div className="modal-button-row">
                            <Button className="btn-blue" type="submit">Create</Button>
                            <Button className="btn-blue" type="button" onClick={handleCloseModal}>Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>

            </BaseModal>

        </main>
    );
}

export default Users;