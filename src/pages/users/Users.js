import React, {useContext, useEffect, useState} from 'react';
import {errorHandler} from "../../helpers/errorHandler";
import {createUser, getUsers} from "../../service";
import Button from "../../components/button/Button";
import {useNavigate} from "react-router-dom";
import UserCreationModal from "../../modals/UserCreationModal";
import {AuthContext} from "../../context/AuthContext";


function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const { token } = useContext(AuthContext);


    const handleViewUser = (username) => {
        navigate(`/profile/${username}`);
    };

    const handleNewClick = () => {
        console.log("new click")
        setShowModal(true); // Show the modal
    };

    const handleModalClose = () => {
        setShowModal(false); // Hide the modal
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
                <Button children="NEW" type="button" onClick={handleNewClick}/>
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
                                    <td>{user.employee?.id}</td>
                                    <td>{ <Button children="view" onClick={() => handleViewUser(user.username)} />}</td>
                                </tr>

                            }
                        )}
                        </tbody>
                    </table>}
            </div>
            <UserCreationModal
                isOpen={showModal}
                onClose={handleModalClose}
                onSubmit={async formData => {
                    console.log('Form submitted with data:', formData);
                    try {
                        await createUser(token, formData.username, formData.password, formData.userRole, formData.email, formData.isDeleted)
                    } catch (e) {
                        console.log(e)
                    }
                    // Here you would handle the form submission e.g., by calling an API
                    // After submission, you would likely want to fetch the updated list of users
                    // and then close the modal
                    setShowModal(false);
                }}
            />
        </main>
    );
}

export default Users;