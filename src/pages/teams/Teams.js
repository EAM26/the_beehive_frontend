import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/AuthContext";
import Button from "../../components/button/Button";
import {getTeams} from "../../service";
import {errorHandler} from "../../helpers/errorHandler";

function Teams(props) {

    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const {token} = useContext(AuthContext);

    const handleNewTeamClick = (e) => {
        console.log("HandleNewTeam")
    }

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                const teamsData = await getTeams(token, controller.signal);
                setTeams(teamsData)
            } catch (e) {
                setError(true);
                setErrormessage(errorHandler(e));
            } finally {
                console.log("finally block")
                setLoading(false);
            }

        }
        void fetchData();
        console.log(teams)
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
                                <td>{team.isActive? "Active": "Inactive"}</td>
                            <td><td>{<Button children="view" onClick={() => handleViewUser(user.username)}/>}</td></td>
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