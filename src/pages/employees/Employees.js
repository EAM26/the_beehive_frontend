import React, {useEffect, useState} from 'react';
import {errorHandler} from "../../helpers/errorHandler";
import {getEmployees} from "../../service";


function Employees() {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")


    useEffect(() => {
        const controller = new AbortController();
        const token = localStorage.getItem('token');

        const fetchData = async () => {
            try {
                setLoading(true);
                const employeesData = await getEmployees(token, controller.signal);
                setEmployees(employeesData);
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
        <div>
            <h2>Employees</h2>
            {loading && <p>Loading...</p>}
            {error ? <p>{errorMessage}</p> :
                <table>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Roosternaam</th>
                        <th>Voornaam</th>
                        <th>Achternaam</th>
                        <th>Email</th>
                        <th>Team</th>

                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((employee) => {
                            return <tr key={employee.id}>
                                <td>{employee.id}</td>
                                <td>{employee.shortName}</td>
                                <td>{employee.firstName}</td>
                                <td>{employee.preposition} {employee.lastName}</td>
                                <td>{employee.email}</td>
                                <td>{employee.team.teamName}</td>
                            </tr>
                        }
                    )}
                    </tbody>
                </table>}
        </div>
    );
}

export default Employees;