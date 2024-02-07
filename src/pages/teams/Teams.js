import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/AuthContext";
import Button from "../../components/button/Button";
import {getTeams} from "../../service";
import {errorHandler} from "../../helpers/errorHandler";
import {useNavigate} from "react-router-dom";

function Teams(props) {

    const navigate = useNavigate();
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const {token} = useContext(AuthContext);

    const handleNewTeamClick = (e) => {
        console.log("HandleNewTeam")
    }

    const handleViewTeam = (teamName) => {
        navigate(`/teams/${teamName}`);
    }

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getTeams(token, controller.signal);
                setTeams(response)
            } catch (e) {
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
                <h2>Teams</h2>
                <Button children="NEW TEAM" type="button" onClick={handleNewTeamClick}/>
                {loading && <p>Loading...</p>}
                {error ? <p>{errorMessage}</p> : <table>
                    <thead>
                    <tr>
                        <th>Team Name</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teams.map((team) => {

                            return <tr key={team.teamName}>
                                <td>{team.teamName}</td>
                                <td>{team.isActive ? "Active" : "Inactive"}</td>
                                <td>{<Button children="view" onClick={() => handleViewTeam(team.teamName)}/>}</td>
                            </tr>

                        }
                    )}
                    </tbody>
                </table>}
            </div>
        </main>
    );
}

export default Teams;