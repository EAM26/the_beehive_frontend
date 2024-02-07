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
    const [rosters, setRosters] = useState({});
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
                if(response.rostersOutputDto) {
                    setRosters(response.rosters);
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

                        {employees.map((employee) => {
                           return  <tr key={employee.id}>
                               <td>{employee.shortName} </td>
                               <td>{employee.id}</td>
                                <td>{employee.isActive? "Active" : "Inactive"}</td>
                               <td>{<Button children="view" onClick={() => handleViewUser(employee.username)}/>}</td>
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