import React, {useContext, useEffect, useState} from 'react';
import {errorHandler} from "../../helpers/errorHandler";
import {createEmployee, createUser, getUserData, getUsers} from "../../service";
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


    const handleViewUser = (username) => {
        navigate(`/profile/${username}`);
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


    useEffect(() => {
        const controller = new AbortController();
        const token = localStorage.getItem('token');

        const fetchData = async () => {
            try {
                setLoading(true);
                const usersData = await getUsers(token, controller.signal);
                setUsers(usersData);
                console.log("fetch data running")
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
    }, []);


    return (
        <main>
            <div>
                <h2>Users</h2>
                <Button children="NEW" type="button" onClick={handleNewUserClick}/>
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
                    console.log('Form submitted with data:', formData);
                    try {
                        const id = await createUser(token, formData.username, formData.password, formData.userRole, formData.email, formData.isDeleted)
                        const newUser = await getUserData(token, id);
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
                        // setUsers(currentUsers => {
                        //     return currentUsers.map(user => {
                        //         console.log(user.employee.id)
                        //         console.log(newEmployee.id)
                        //         if (user.employee?.id === newEmployee.id) {
                        //             return {
                        //                 ...user,
                        //                 employee: { ...newEmployee }
                        //             };
                        //         }
                        //         return user;
                        //     });
                        // });
                        setUsers(currentUsers => {
                            return currentUsers.map(user => {
                                if (user.username === selectedUsername) { // Gebruik de opgeslagen username om de juiste user te vinden
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