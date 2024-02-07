import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getSingleTeam} from "../../service";
import {AuthContext} from "../../context/AuthContext";
import Button from "../../components/button/Button";
import {errorHandler} from "../../helpers/errorHandler";

function SingleTeam(props) {

    const {teamName} = useParams()
    const {token} = useContext(AuthContext);
    const [employees, setEmployees] = useState([]);
    const [rosters, setRosters] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")

    const handleViewUser = ((username) =>  {
        navigate(`/profile/${username}`);
    })
    useEffect(() => {


        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const response = await getSingleTeam(token, controller.signal, teamName);
                if(response.employeesOutputDtos) {
                    setEmployees(response.employeesOutputDtos.sort((a, b) =>
                        a.shortName.localeCompare(b.shortName)
                    ));
                }
                if(response.rostersOutputDtos) {
                    setRosters(response.rostersOutputDtos);
                }

            } catch (e) {
                setError(true);
                setErrormessage(errorHandler(e));
            } finally {


            }
        }

        void fetchData();
        return function cleanup() {
            controller.abort();
        }

    }, []);


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

                        {employees && employees.map((employee) => {
                           return  <tr key={employee.id}>
                               <td>{employee.shortName} </td>
                               <td>{employee.id}</td>
                                <td>{employee.isActive? "Active" : "Inactive"}</td>
                               <td>{<Button children="view" onClick={() => handleViewUser(employee.username)}/>}</td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                    <div>
                        <span>Rosters</span>
                        <table>
                            <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                            </thead>

                            <tbody>
                            {rosters && rosters.map((roster) => {
                                return <tr key={roster.id}>
                                    <td>{roster.name}</td>
                                    <td><Button children="View"/></td>
                                </tr>
                            })}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default SingleTeam;