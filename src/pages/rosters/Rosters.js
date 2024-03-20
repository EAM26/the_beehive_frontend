import React, {useContext, useEffect, useState} from 'react';
import {errorHandler} from "../../helpers/errorHandler";
import {AuthContext} from "../../context/AuthContext";
import {createRoster, getRosters, getTeams} from "../../service";
import Button from "../../components/button/Button";
import {sortRostersByYearAndWeek} from "../../helpers/mySorterFunctions";
import BaseModal from "../../components/baseModal/BaseModal";
import {useNavigate} from "react-router-dom";
import FormInputField from "../../components/FormInputField/FormInputField";
import '../../components/FormInputField/FormInputField.css'
import '../../components/baseModal/BaseModal.css'
import {useForm} from "react-hook-form";
import './Rosters.css';
import {Eye, PlusCircle} from "@phosphor-icons/react";
function Rosters() {

    const [rosterCreated, setRosterCreated] = useState({})
    const [rosters, setRosters] = useState([])
    const {token} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [teams, setTeams] = useState([]);
    const {register, reset, handleSubmit, formState: {errors},} = useForm({
        defaultValues: {
            isActive: true
        }
    })

    const teamOptions = teams.map(team => ({
        value: team.teamName,
        label: team.teamName
    }));

    const weekOptions = Array.from({ length: 53 }, (_, index) => index + 1);
    const yearOptions = Array.from({ length: 20 }, (_, index) => index + 2020);

    const handleOnClose = () => {
        setShowModal(false)
    }

    const handleSubmitRoster = async (newRoster) => {
        setLoading(true)
        setError(false)
        setErrormessage("")
        try {
            const response = await createRoster(token, newRoster.week, newRoster.year, newRoster.teamName);
            setRosterCreated(response)
            reset()
            setShowModal(false);
        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
            console.error(e)
        } finally {
            setLoading(false)
        }

    };

    const handleClickView = (rosterId) => {
        navigate(`/rosters/${rosterId}`)
    }

    useEffect(() => {
        const fetchTeamsData = (async () => {
            setLoading(true)
            try {
                const response = await getTeams(token);
                setTeams(response);
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }

        })
        void fetchTeamsData();
    }, []);


    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            setLoading(true);
            setError(false);
            setErrormessage("");
            try {
                const response = await getRosters(token, controller.signal);
                sortRostersByYearAndWeek(response)
                setRosters(response)
            } catch (e) {
                setError(true);
                setErrormessage(errorHandler(e));
            } finally {
                setLoading(false)
            }

        }

        void fetchData()
        return function cleanup() {
            controller.abort();
        }
    }, [rosterCreated]);


    return (
        <main className="outer-container">
            <div className="inner-container">
                {loading && <p>Loading...</p>}
                <p className="error-message">{error ? errorMessage: ""}</p>
                <div className="rosters-head">
                <h2>Rosters</h2>
                    <Button className="btn-new btn-blue" type="button" onClick={() => setShowModal(true)}>
                        <p>new</p>
                        <PlusCircle size={20}/>
                    </Button>

                </div>
                    <table className="rosters-table">
                    <thead>
                    <tr>
                        <th>Week</th>
                        <th>Year</th>
                        <th>Team</th>

                    </tr>
                    </thead>
                    <tbody>
                    {rosters.map((roster) => {
                        const [week, year, team] = roster.name.split('-');
                        return <tr key={roster.id}>
                            <td>{week}</td>
                            <td>{year}</td>
                            <td>{team}</td>
                            <td className="rosters-td-button">
                                {<Button
                                    className="btn-logo btn-view"
                                    children={<Eye size={20}/>}
                                    onClick={() => handleClickView(roster.id)}/>}
                            </td>
                        </tr>
                    })}

                    </tbody>
                </table>
                {showModal && (
                    <BaseModal
                        isOpen={showModal}
                        onClose={handleOnClose}>
                        <form onSubmit={handleSubmit(handleSubmitRoster)}>
                            <p className="error-message">{error ? errorMessage: ""}</p>
                            <FormInputField
                                className="modal-item"
                                label="Week"
                                type="select"
                                name="week"
                                id="week"
                                options={weekOptions.map(week => ({ value: week, label: week.toString() }))}
                                errors={errors}
                                register={register}
                                validation={{required: "Field is required"}}
                                disabled="disabled"
                                selected="selected"
                                defaultName="week"
                            />
                            <FormInputField
                                className="modal-item"
                                label="Year"
                                type="select"
                                name="year"
                                id="year"
                                options={yearOptions.map(year => ({ value: year, label: year.toString() }))}
                                errors={errors}
                                register={register}
                                validation={{required: "Field is required"}}
                                disabled="disabled"
                                selected="selected"
                                defaultName="year"
                            />
                            <FormInputField
                                className="modal-item"
                                label="Team"
                                type="select"
                                name="teamName"
                                id="teamName"
                                options={teamOptions}
                                errors={errors}
                                register={register}
                                validation={{required: "Field is required"}}
                                disabled="disabled"
                                selected="selected"
                                defaultName="team"
                            />
                            <div className="modal-button-row">
                                <Button className="btn-blue" type="submit">Create</Button>
                            <Button className="btn-blue" type="button" onClick={handleOnClose}>Cancel</Button>
                            </div>
                        </form>
                    </BaseModal>
                )}
            </div>
        </main>
    );
}

export default Rosters;