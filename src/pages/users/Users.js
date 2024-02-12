import React, {useContext, useEffect, useState} from 'react';
import {errorHandler} from "../../helpers/errorHandler";
import {createEmployee, createUser, getTeams, getUser, getUsers} from "../../service";
import Button from "../../components/button/Button";
import {useNavigate} from "react-router-dom";
import UserCreationModal from "../../modals/UserCreationModal";
import {AuthContext} from "../../context/AuthContext";
import BaseModal from "../../components/baseModal/BaseModal";


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



    const handleViewUser = (username) => {
        navigate(`/users/${username}`);
    };

    const handleNewUserClick = () => {
        setShowUserModal(true);
    };

    const handleNewEmployeeClick = (username) => {
        console.log("handleNewEmployeeClick")
        setSelectedUsername(username);
        setShowEmployeeModal(true)

    }

    const handleCloseModal = () => {
        setShowUserModal(false);
        setShowEmployeeModal(false);
        setSelectedUsername('')
    };

    const handleDeletedFilterChange = (e) => {
        setDeletedFilter(e.target.value);
    };

    const handleEmployeeFilterChange = (e) => {
        setEmployeeFilter(e.target.value);
    };

    const handleSubmitEmployee  = async (e) => {
        e.preventDefault()
        try {
            const newEmployee = await createEmployee(token, formDataEmployee.firstName, formDataEmployee.preposition, formDataEmployee.lastName, formDataEmployee.shortName, formDataEmployee.dob, formDataEmployee.isActive, formDataEmployee.phoneNumber, formDataEmployee.teamName, selectedUsername)
            setUsers(currentUsers => {
                return currentUsers.map(user => {
                    if (user.username === selectedUsername) {
                        return {
                            ...user,
                            employee: { ...newEmployee }
                        };
                    }
                    return user;
                });
            });

        } catch (e) {
            console.log(e)
        }

        setShowEmployeeModal(false);
    }

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormDataEmployee(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

    // if (!teams) {
    //     return <div>Loading...</div>;
    // }


    useEffect(() => {
        console.log("use effect userData")
        const controller = new AbortController();
        // const token = localStorage.getItem('token');

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
                                    <td>{user.employee ? user.employee.id : <Button children="+Employee"
                                                                                    onClick={() => handleNewEmployeeClick(user.username)}/>}</td>
                                    <td>{<Button children="view" onClick={() => handleViewUser(user.username)}/>}</td>
                                </tr>

                            }
                        )}
                        </tbody>
                    </table>}
            </div>
            <UserCreationModal
                isOpen={showUserModal}
                onClose={handleCloseModal}
                onSubmit={async formData => {
                    try {
                        const id = await createUser(token, formData.username, formData.password, formData.userRole, formData.email, formData.isDeleted)
                        const newUser = await getUser(token, id);
                        setUsers(currentUsers => [...currentUsers, newUser]);
                        const updatedUsers = [...users, newUser];
                        setUsers(updatedUsers.sort((a, b) => a.username.localeCompare(b.username)));
                        console.log(id)
                    } catch (e) {
                        console.log(e)
                    }

                    setShowUserModal(false);
                }}
            />
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
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Preposition:</label>
                            <input
                                type="text"
                                name="preposition"
                                value={formDataEmployee.preposition}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Last Name:</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formDataEmployee.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Short Name:</label>
                            <input
                                type="text"
                                name="shortName"
                                value={formDataEmployee.shortName}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Date of Birth:</label>
                            <input
                                type="date"
                                name="dob"
                                value={formDataEmployee.dob}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Phone Number:</label>
                            <input
                                type="text"
                                name="phoneNumber"
                                value={formDataEmployee.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>Team</label>
                            <select  name="teamName" onChange={handleChange} defaultValue={""}>
                                <option value="" disabled>team</option>
                                {teams.map((team)=> {
                                    return <option key={team.teamName} value={team.teamName}>{team.teamName}</option>
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
                                    onChange={handleChange}
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