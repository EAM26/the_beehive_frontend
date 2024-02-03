import React, {useEffect, useState} from 'react';
import {errorHandler} from "../../helpers/errorHandler";
import {getUsers} from "../../service";
import Button from "../../components/button/Button";


function Employees() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")


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
                                return <tr key={user.id}>

                                    <td>{user.username}</td>
                                    <td>{user.employee?.firstName} {user.employee?.preposition} {user.employee?.lastName}</td>
                                    <td>{user.isDeleted ? "Not Active" : "Active"}</td>
                                    <td>{user.email} </td>
                                    <td>{authoritiesDisplay}</td>
                                    <td>{user.employee?.id}</td>
                                    <Button children="view"/>
                                </tr>
                            }
                        )}
                        </tbody>
                    </table>}
            </div>
        </main>
    );
}

export default Employees;