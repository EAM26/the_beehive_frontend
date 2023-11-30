import React, {useEffect, useState} from 'react';
import axios from "axios";
import {errorHandler} from "../../helpers/errorHandler";




function Employees() {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage,  setErrormessage] = useState("")
    const controller = new AbortController()


    useEffect(() => {
        void getEmployees();
        return function cleanup() {
            controller.abort()
        }
    }, []);

    return (
        <div>
            <h2>Employees</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{errorMessage}</p>}
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
            </table>
        </div>
    );


    async function getEmployees() {
        setLoading(true)
        setErrormessage('')
        setError(false)

        const token = localStorage.getItem('token')

        try {
            const response = await axios.get('http://localhost:8080/employees',
                {headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    signal: controller.signal})

            setEmployees(response.data)
        } catch (e) {
            setError(true)
            setErrormessage(errorHandler(e))
            console.error("Error: getEmployees", e)
        }
        setLoading(false)
    }
}



export default Employees;