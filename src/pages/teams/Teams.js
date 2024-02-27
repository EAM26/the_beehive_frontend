import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/AuthContext";
import Button from "../../components/button/Button";
import {createTeam, getTeams} from "../../service";
import {errorHandler} from "../../helpers/errorHandler";
import {useNavigate} from "react-router-dom";
import BaseModal from "../../components/baseModal/BaseModal";
import {mySorterIgnoreCaseSingleAttr} from "../../helpers/mySorterFunctions";


function Teams(props) {

    const [teamCreated, setTeamCreated] = useState({})
    const navigate = useNavigate();
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const {token} = useContext(AuthContext);
    const [showTeamModal, setShowTeamModal] = useState(false)
    const [formData, setFormData] = useState({
        teamName: '',
        isActive: true,

    });

    const handleNewTeamClick = (e) => {
        setShowTeamModal(true)
    }

    const handleCloseModal = () => {
        setShowTeamModal(false)
    };

    const handleViewTeam = (teamName) => {
        navigate(`/teams/${teamName}`);
    }

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e)  => {
        e.preventDefault()
        setError(false)
        setErrormessage("")
        try {
            const response = await createTeam(token,  formData.teamName, formData.isActive)
            setTeamCreated(response)
            setFormData({teamName: '', isActive: true});
            setError(false)
            setErrormessage("")

        } catch (e) {
            setError(true)
            setErrormessage(errorHandler(e))
            console.error(e)
        }

        setShowTeamModal(false)
    };


    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getTeams(token, controller.signal);
                setTeams(mySorterIgnoreCaseSingleAttr(response, "teamName"))
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
    }, [teamCreated]);


    return (
        <main className="outer-container">
            <div className="inner-container">
                {loading && <p>Loading...</p>}
                <p className="error-message">{error ? errorMessage: ""}</p>
                <h2>Teams</h2>
                <Button children="NEW TEAM" type="button" onClick={handleNewTeamClick}/>

                <table>
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
                </table>
            </div>
            <BaseModal
                onClose={handleCloseModal}
                isOpen={showTeamModal}>
                <div className="modal">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Team Name:</label>
                                <input
                                    type="text"
                                    name="teamName"
                                    value={formData.teamName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>
                                    Team Active:
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        disabled={true}
                                    />
                                </label>
                            </div>
                            <Button type="submit">Create Team</Button>
                            <Button type="button" onClick={handleCloseModal}>Cancel</Button>
                        </form>
                    </div>
                </div>
            </BaseModal>

        </main>
    );
}

export default Teams;