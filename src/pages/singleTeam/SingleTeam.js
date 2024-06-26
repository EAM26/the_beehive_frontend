import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getSingleTeam} from "../../service";
import {AuthContext} from "../../context/AuthContext";
import {errorHandler} from "../../helpers/errorHandler";
import "./SingleTeam.css"
import {
    mySorterIgnoreCase,
    mySorterTwoAttributes,
    sortRostersAsString,
    sortRostersByYearAndWeek
} from "../../helpers/mySorterFunctions";

function SingleTeam() {

    const {teamName} = useParams()
    const {token} = useContext(AuthContext);
    const [teamData, setTeamData] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")

    // const handleViewUser = ((username) =>  {
    //     navigate(`/profile/${username}`);
    // })
    useEffect(() => {


        const controller = new AbortController();
        const fetchData = async () => {
            setLoading(true);
            setError(false);
            setErrormessage("");
            try {
                const response = await getSingleTeam(token, controller.signal, teamName);
                mySorterIgnoreCase(response.employeesData)
                sortRostersAsString(response.rosterData)

                setTeamData(response);

            } catch (e) {
                console.error(e)
                setError(true);
                setErrormessage(errorHandler(e));

            } finally {
                setLoading(false);

            }
        }

        void fetchData();
        return function cleanup() {

            controller.abort();
        }

    }, []);

    return (
        <main className="outer-container">
            <div className="inner-container">
                {loading && <p>Loading...</p>}
                {error && <p className="error-message">{errorMessage}</p>}
                <div className="singleTeam-page">
                    <h2>{teamName}</h2>
                    <div className="singleTeam-content">
                    <div className="team-content-items">
                        <h3>Employees</h3>
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
                    <div className="team-content-items">
                        <h3>Rosters</h3>
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
            </div>
        </main>
    );
}

export default SingleTeam;