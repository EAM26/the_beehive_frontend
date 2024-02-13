import React, {useContext, useEffect, useState} from 'react';
import {errorHandler} from "../../helpers/errorHandler";
import {createEmployee, createUser, getTeams, getUser, getUsers} from "../../service";
import Button from "../../components/button/Button";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import BaseModal from "../../components/baseModal/BaseModal";
import FormInputField from "../../components/FormInputField/FormInputField";
import {useForm} from "react-hook-form";


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
    const {register, reset, handleSubmit, formState: {errors}, setValue} = useForm({})
    const [formDataEmployee, setFormDataEmployee] = useState({
        firstName: '',
        preposition: '',
        lastName: '',
        shortName: '',
        dob: '',
        phoneNumber: '',
        teamName: '',
        isActive: true,

    });
    const [formDataUser, setFormDataUser] = useState({
        username: '',
        password: '',
        userRole: '',
        email: '',
        isDeleted: false,

    });

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
        try {

            const id = await createUser(token, formDataUser.username, formDataUser.password, formDataUser.userRole, formDataUser.email, formDataUser.isDeleted)
            const newUser = await getUser(token, id);
            setUsers(currentUsers => [...currentUsers, newUser]);
            const updatedUsers = [...users, newUser];
            setUsers(updatedUsers.sort((a, b) => a.username.localeCompare(b.username)));
            reset();

        } catch (e) {
            console.error(e)
        }
        setShowUserModal(false)
    };



    // Employee functions
    const handleNewEmployeeClick = (username) => {
        setSelectedUsername(username);
        setShowEmployeeModal(true)
    }

    const handleSubmitEmployee = async (e) => {
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

        } catch (e) {
            console.error(e)
        }

        setShowEmployeeModal(false);
    }

    const handleChangeEmployeeField = (e) => {
        const {name, value, type, checked} = e.target;
        setFormDataEmployee(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCloseModal = () => {
        setShowUserModal(false);
        setShowEmployeeModal(false);
        setSelectedUsername('')
    };

    useEffect(() => {
        console.log("useEffect team data")
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
            try {
                setLoading(true);
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
                <h2>Users</h2>
                <Button children="NEW USER" type="button" onClick={handleNewUserClick}/>
                <div>
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
                {loading && <p>Loading...</p>}
                {error ? <p>{errorMessage}</p> :
                    <table>
                        <thead>
                        <tr>
                            <th>Id</th>
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
                                    <td>{user.employee ? user.employee.id :
                                        <Button children="+Employee"
                                                onClick={() => handleNewEmployeeClick(user.username)}/>}
                                    </td>
                                    <td>
                                        {<Button children="view" onClick={() => handleViewUser(user.username)}/>}
                                    </td>
                                </tr>
                            }
                        )}
                        </tbody>
                    </table>}
            </div>
            {/* User Modal */}
            <BaseModal
                isOpen={showUserModal}
                onClose={handleCloseModal}>
                <div className="modal">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit(handleSubmitUser)}>
                            <FormInputField
                                label="UserName"
                                name="username"
                                type="text"
                                id="username"
                                defaultValue=""
                                errors={errors}
                                register={register}
                                validation={{required: "Field is required"}}
                            />
                            <FormInputField
                                label="Password"
                                name="password"
                                type="password"
                                id="password"
                                defaultValue=""
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
                                label="Authority"
                                name="userRole"
                                type="text"
                                id="userRole"
                                errors={errors}
                                register={register}
                                validation={{required: "Field is required"}}
                            />

                            <FormInputField
                                label="Deleted"
                                name="isDeleted"
                                type="checkbox"
                                id="isDeleted"
                                errors={errors}
                                register={register}
                            />

                            <button type="submit">Create User</button>
                            <button type="button" onClick={handleCloseModal}>Cancel</button>
                        </form>
                    </div>
                </div>
            </BaseModal>
            {/*<UserCreationModal*/}
            {/*    isOpen={showUserModal}*/}
            {/*    onClose={handleCloseModal}*/}
            {/*    onSubmit={async formData => {*/}
            {/*        try {*/}
            {/*            const id = await createUser(token, formData.username, formData.password, formData.userRole, formData.email, formData.isDeleted)*/}
            {/*            const newUser = await getUser(token, id);*/}
            {/*            setUsers(currentUsers => [...currentUsers, newUser]);*/}
            {/*            const updatedUsers = [...users, newUser];*/}
            {/*            setUsers(updatedUsers.sort((a, b) => a.username.localeCompare(b.username)));*/}
            {/*            console.log(id)*/}
            {/*        } catch (e) {*/}
            {/*            console.log(e)*/}
            {/*        }*/}

            {/*        setShowUserModal(false);*/}
            {/*    }}*/}
            {/*/>*/}


            {/*Employee Modal*/}
            <BaseModal
                isOpen={showEmployeeModal}
                onClose={handleCloseModal}
            >
                <div className="modal">
                    <div className="modal-content">
                        <form onSubmit={handleSubmitEmployee}>
                            <div>
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formDataEmployee.firstName}
                                    onChange={handleChangeEmployeeField}
                                />
                            </div>
                            <div>
                                <label>Preposition:</label>
                                <input
                                    type="text"
                                    name="preposition"
                                    value={formDataEmployee.preposition}
                                    onChange={handleChangeEmployeeField}
                                />
                            </div>
                            <div>
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formDataEmployee.lastName}
                                    onChange={handleChangeEmployeeField}
                                />
                            </div>
                            <div>
                                <label>Short Name:</label>
                                <input
                                    type="text"
                                    name="shortName"
                                    value={formDataEmployee.shortName}
                                    onChange={handleChangeEmployeeField}
                                />
                            </div>
                            <div>
                                <label>Date of Birth:</label>
                                <input
                                    type="date"
                                    name="dob"
                                    value={formDataEmployee.dob}
                                    onChange={handleChangeEmployeeField}
                                />
                            </div>
                            <div>
                                <label>Phone Number:</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formDataEmployee.phoneNumber}
                                    onChange={handleChangeEmployeeField}
                                />
                            </div>
                            <div>
                                <label>Team</label>
                                <select name="teamName" onChange={handleChangeEmployeeField} defaultValue={""}>
                                    <option value="" disabled>team</option>
                                    {teams.map((team) => {
                                        return <option key={team.teamName}
                                                       value={team.teamName}>{team.teamName}</option>
                                    })}
                                </select>

                            </div>
                            <div>
                                <label>
                                    Employee Active:
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formDataEmployee.isActive}
                                        onChange={handleChangeEmployeeField}
                                    />
                                </label>
                            </div>
                            <Button type="submit">Create Employee</Button>
                            <Button type="button" onClick={handleCloseModal}>Cancel</Button>
                        </form>
                    </div>
                </div>

            </BaseModal>

        </main>
    );
}

export default Users;