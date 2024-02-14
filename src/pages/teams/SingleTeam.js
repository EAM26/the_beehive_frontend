import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getSingleTeam} from "../../service";
import {AuthContext} from "../../context/AuthContext";
import {errorHandler} from "../../helpers/errorHandler";
import "./SingleTeam.css"
import {mySorterIgnoreCase, mySorterTwoAttributes} from "../../helpers/mySorterFunctions";

function SingleTeam(props) {

    const {teamName} = useParams()
    const {token} = useContext(AuthContext);
    const [teamData, setTeamData] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")

    const handleViewUser = ((username) =>  {
        navigate(`/profile/${username}`);
    })
    useEffect(() => {


        const controller = new AbortController();
        const fetchData = async (e) => {
            try {
                const response = await getSingleTeam(token, controller.signal, teamName);
                //
                mySorterIgnoreCase(response.employeesData)
                mySorterTwoAttributes(response.rosterData, "week", "year")
                setTeamData(response);

            } catch (e) {
                console.error(e)
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

    console.log(teamData)
    return (
        <main className="outer-container">
            <div className="inner-container">
                <h3>{teamName}</h3>
                <div className="singleTeam-outer-container">
                    <div>
                        <span>Employees</span>
                        <table>
                            <thead>
                            <tr>
                                <th>Short Name</th>
                            </tr>
                            </thead>
                            <tbody>
                            {teamData.employeesData && teamData.employeesData.map((name) => {
                                return <tr key={name}>
                                    <td>{name} </td>

                                </tr>
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <span>Rosters</span>
                        <table>
                            <thead>
                            <tr>
                                <th>Roster Name</th>
                            </tr>
                            </thead>
                            <tbody>
                            {teamData.rosterData && teamData.rosterData.map((name) => {
                                return <tr key={name}>
                                    <td>{name} </td>

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