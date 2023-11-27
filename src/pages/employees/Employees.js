import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";


function Employees() {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false)
    const {hasAuthLevel} = useContext(AuthContext)

    useEffect(() => {
        console.log("Authlevel from employees: ",hasAuthLevel)
        async function getEmployees() {
            setLoading(true)
            try {
                const response = await axios.get('http://localhost:8080/employees')
                setEmployees(response.data)
            } catch (e) {
                console.error("Couldn't fetch employees: ", e)
            }
            setLoading(false)
        }

        void getEmployees();

    }, []);
    return (
        <div>
            <h2>Employees</h2>
            {/*{loading && <p>Loading...</p>}*/}
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
}

export default Employees;