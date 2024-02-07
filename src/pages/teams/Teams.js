import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/AuthContext";
import Button from "../../components/button/Button";
import {createTeam, getTeams} from "../../service";
import {errorHandler} from "../../helpers/errorHandler";
import {useNavigate} from "react-router-dom";
import TeamCreationModal from "../../modals/TeamCreationModal";


function Teams(props) {

    const navigate = useNavigate();
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const {token} = useContext(AuthContext);
    const [showTeamModal, setShowTeamModal] = useState(false)
    // const [ controller, setController ] = useState({})

    const handleNewTeamClick = (e) => {
        setShowTeamModal(true)
    }

    const handleCloseModal = () => {
        setShowTeamModal(false)
    };

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
            <TeamCreationModal
            isOpen={showTeamModal}
            onClose={handleCloseModal}
            onSubmit={async formData => {
                const controller = new AbortController();
                try {
                  const newTeam = await createTeam(token, controller.signal, formData.teamName, formData.isActive)
                } catch (e) {
                    console.error(e)
                }
                setShowTeamModal(false)
            }}
            />
        </main>
    );
}

export default Teams;