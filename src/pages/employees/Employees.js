import React, {useEffect, useState} from 'react';
import axios from "axios";

function Employees() {

    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        async function getEmployees() {
            try {
                const response = await axios.get('http://localhost:8080/employees')
                setEmployees(response.data)
                console.log(employees)
            } catch (e) {
                console.error("Kon employees niet ophalen: ", e)
            }

        }

        getEmployees();

    }, []);
    return (
        <div>
            <h2>Employees</h2>
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