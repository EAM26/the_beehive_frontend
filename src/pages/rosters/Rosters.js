import React, {useContext, useEffect, useState} from 'react';
import {errorHandler} from "../../helpers/errorHandler";
import {AuthContext} from "../../context/AuthContext";
import {createRoster, getRosters, getTeams} from "../../service";
import Button from "../../components/button/Button";
import {sortRostersByYearAndWeek} from "../../helpers/mySorterFunctions";
import BaseModal from "../../components/baseModal/BaseModal";
import {useNavigate} from "react-router-dom";
import FormInputField from "../../components/FormInputField/FormInputField";
import {useForm} from "react-hook-form";

function Rosters(props) {

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
    const [newRoster, setNewRoster] = useState({
        week: '',
        year: '',
        teamName: ''
    });
    const teamOptions = teams.map(team => ({
        value: team.teamName,
        label: team.teamName
    }));

    const weekOptions = Array.from({ length: 53 }, (_, index) => index + 1);
    const yearOptions = Array.from({ length: 20 }, (_, index) => index + 2020);

    const handleOnClose = () => {
        setShowModal(false)
    }

    // const handleInputChange = (e) => {
    //     setNewRoster({...newRoster, [e.target.name]: e.target.value});
    // };

    const handleSubmitRoster = async (newRoster) => {
        // e.preventDefault()
        try {
            console.log(newRoster)
            const response = await createRoster(token, newRoster.week, newRoster.year, newRoster.teamName);
            setRosterCreated(response)
            setError(false)
            setErrormessage("")

        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
            console.error(e)
        } finally {
        }
        setShowModal(false);
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
            setLoading(true)
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
                <h2>Rosters</h2>
                <Button children="NEW ROSTER" type="button" onClick={() => setShowModal(true)}/>

                {loading && <p>Loading...</p>}
                <p>{error ? errorMessage : ""}</p>
                <table>
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
                            <td><Button onClick={() => handleClickView(roster.id)} children="view"/></td>
                        </tr>
                    })}

                    </tbody>
                </table>
                {showModal && (
                    <BaseModal
                        isOpen={showModal}
                        onClose={handleOnClose}>
                        <form onSubmit={handleSubmit(handleSubmitRoster)}>

                            <FormInputField
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
                            /><FormInputField
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

                            {/*<div>*/}
                            {/*    <label>*/}
                            {/*        Week:*/}
                            {/*    </label>*/}
                            {/*    <input type="text" name="week" value={newRoster.week} onChange={handleInputChange}/>*/}

                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    <label>*/}
                            {/*        Year:*/}
                            {/*        <input type="text" name="year" value={newRoster.year} onChange={handleInputChange}/>*/}
                            {/*    </label>*/}
                            {/*</div>*/}
                            {/*<div>*/}
                            {/*    <label>*/}
                            {/*        Team Name:*/}
                            {/*        <input type="text" name="teamName" value={newRoster.teamName}*/}
                            {/*               onChange={handleInputChange}/>*/}
                            {/*    </label>*/}
                            {/*</div>*/}

                            <Button type="submit">Add Roster</Button>
                            <Button type="button" onClick={handleOnClose}>Cancel</Button>
                        </form>
                    </BaseModal>
                )}
            </div>
        </main>
    );
}

export default Rosters;