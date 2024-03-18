import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/AuthContext";
import Button from "../../components/button/Button";
import {createTeam, getTeams} from "../../service";
import {errorHandler} from "../../helpers/errorHandler";
import {useNavigate} from "react-router-dom";
import BaseModal from "../../components/baseModal/BaseModal";
import {mySorterIgnoreCaseSingleAttr} from "../../helpers/mySorterFunctions";
import {useForm} from "react-hook-form";
import FormInputField from "../../components/FormInputField/FormInputField";
import '../../index.css'
import '../../App.css'
import './Teams.css'
import '../../components/FormInputField/FormInputField.css'
import {PlusCircle} from "@phosphor-icons/react";


function Teams() {

    const [teamCreated, setTeamCreated] = useState({})
    const navigate = useNavigate();
    const [teams, setTeams] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const {token} = useContext(AuthContext);
    const [showTeamModal, setShowTeamModal] = useState(false)

    const {register, reset, handleSubmit, formState: {errors},} = useForm({
        defaultValues: {
            isActive: true
        }
    })

    const handleNewTeamClick = () => {
        setShowTeamModal(true)
    }

    const handleCloseModal = () => {
        setShowTeamModal(false)
    };

    const handleViewTeam = (teamName) => {
        navigate(`/teams/${teamName}`);
    }


    const handleSubmitTeam = async (newTeam) => {
        setLoading(true);
        setError(false)
        setErrormessage("")
        try {
            const response = await createTeam(token, newTeam.teamName, newTeam.isActive)
            setTeamCreated(response)
            reset()
            setShowTeamModal(false)

        } catch (e) {
            setError(true)
            setErrormessage(errorHandler(e))
            console.error(e)
        } finally {
            setLoading(false)
        }


    };


    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            setLoading(true);
            setError(false);
            setErrormessage("");
            try {
                const response = await getTeams(token, controller.signal);
                setTeams(mySorterIgnoreCaseSingleAttr(response, "teamName"))
            } catch (e) {
                setError(true);
                setErrormessage(errorHandler(e));
                console.error(e)
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
                <p className="error-message">{error ? errorMessage : ""}</p>
                <div className="teams-head">
                    <h2>Teams</h2>
                    <Button className="btn-new btn-blue" type="button" onClick={handleNewTeamClick}>
                        <p>New</p>
                        <PlusCircle size={20}/>
                    </Button></div>
                <table className="teams-table">
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
                                <td className="td-button" >{<Button className="btn-blue" children="view"
                                             onClick={() => handleViewTeam(team.teamName)}/>}</td>
                            </tr>

                        }
                    )}
                    </tbody>
                </table>
            </div>

            {showTeamModal && (
                <BaseModal
                    onClose={handleCloseModal}
                    isOpen={showTeamModal}>
                    <div className="modal">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit(handleSubmitTeam)}>
                            <p className="error-message">{error ? errorMessage : ""}</p>

                                <FormInputField className="text-input-field"
                                    label="Team Name"
                                    type="text"
                                    name="teamName"
                                    id="teamName"
                                    errors={errors}
                                    register={register}
                                    validation={{
                                        required: "Field is required",
                                        maxLength:  {
                                            value:20,
                                            message: "Not more than 20 characters"
                                        }
                                        }}
                                />
                                <FormInputField className="check-input-field"
                                    label="Team Active"
                                    name="isActive"
                                    type="checkbox"
                                    id="isActive"
                                    register={register}
                                    errors={errors}
                                    disabled={true}
                                />
                                <div className="modal-button-row">
                                <Button type="submit">Create Team</Button>
                                <Button type="button" onClick={handleCloseModal}>Cancel</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </BaseModal>)}

        </main>
    );
}

export default Teams;