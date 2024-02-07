import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {getSingleTeam} from "../../service";
import {AuthContext} from "../../context/AuthContext";

function SingleTeam(props) {

    const {teamName} = useParams()
    const [team, setTeam] = useState({})
    const {token} = useContext(AuthContext);
    const [employees, setEmployees] = useState([]);
    const [rosters, setRosters] = useState({});

    useEffect(() => {
        console.log("useEffect" + teamName)
        console.log("single team function")
        const fetchData = async () => {
            const controller = new AbortController();
            try {
                const response = await getSingleTeam(token, controller.signal, teamName);
                if(response.employees) {
                    setEmployees(response.employees.sort((a, b) =>
                        a.shortName.localeCompare(b.shortName)
                    ));
                }
                if(response.rosters) {
                    setRosters(response.rosters);
                }

            } catch (e) {

            } finally {


            }
        }

        void fetchData();

    }, []);

    console.log(employees)
    console.log(rosters)
    return (
        <main>
            <div>
                <p>SingleTeamPage</p>
                <div>
                    <span>Employees</span>
                    <table>
                        <thead>
                        <tr>
                            <th>Short Name</th>
                            <th>Id</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>

                        {employees.map((employee) => {
                           return  <tr key={employee.id}>
                               <td>{employee.shortName} </td>
                               <td>{employee.id}</td>
                                <td>{employee.isActive? "Active" : "Inactive"}</td>
                            </tr>
                        })}

                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}

export default SingleTeam;