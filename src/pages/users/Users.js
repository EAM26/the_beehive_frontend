import React, {useContext, useEffect, useState} from 'react';
import {errorHandler} from "../../helpers/errorHandler";
import {createEmployee, createUser, getUser, getUsers} from "../../service";
import Button from "../../components/button/Button";
import {useNavigate} from "react-router-dom";
import UserCreationModal from "../../modals/UserCreationModal";
import {AuthContext} from "../../context/AuthContext";
import EmployeeCreationModal from "../../modals/EmployeeCreationModal";


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



    useEffect(() => {
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
            <EmployeeCreationModal
                isOpen={showEmployeeModal}
                onClose={handleCloseModal}
                // username={selectedUsername}
                onSubmit={async formData => {
                    console.log('Form submitted with data:', formData);
                    try {
                        const newEmployee = await createEmployee(token, formData.firstName, formData.preposition, formData.lastName, formData.shortName, formData.dob, formData.isActive, formData.teamName, selectedUsername)

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
                }}
            />
        </main>
    );
}

export default Users;