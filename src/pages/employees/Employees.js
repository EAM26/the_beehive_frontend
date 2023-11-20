import React from 'react';

function Employees() {
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
                <tr>
                    <td>Test table data</td>
                    <td>Test table data</td>
                    <td>Test table data</td>
                    <td>Test table data</td>
                    <td>Test table data</td>
                    <td>Test table data</td>
                </tr>
                {/*{employees.map((employee) => {*/}
                {/*        return <tr key={employee.id}>*/}
                {/*            <td>{employee.id}</td>*/}
                {/*            <td>{employee.shortName}</td>*/}
                {/*            <td>{employee.firstName}</td>*/}
                {/*            <td>{employee.preposition} {employee.lastName}</td>*/}
                {/*            <td>{employee.email}</td>*/}
                {/*            <td>{employee.team.teamName}</td>*/}

                {/*        </tr>*/}

                {/*    }*/}
                {/*)}*/}
                </tbody>
            </table>
        </div>
    );
}

export default Employees;