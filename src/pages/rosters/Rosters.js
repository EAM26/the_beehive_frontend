import React, {useContext, useEffect, useState} from 'react';
import {errorHandler} from "../../helpers/errorHandler";
import {AuthContext} from "../../context/AuthContext";
import {createRoster, getRosters} from "../../service";
import Button from "../../components/button/Button";
import {sortRostersByYearAndWeek} from "../../helpers/mySorterFunctions";
import BaseModal from "../../components/baseModal/BaseModal";
import {useNavigate} from "react-router-dom";

function Rosters(props) {

    const [rosterCreated, setRosterCreated] = useState({})
    const [rosters, setRosters] = useState([])
    const {token} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [newRoster, setNewRoster] = useState({
        week: '',
        year: '',
        teamName: ''
    });

    const handleOnClose = () => {
        setShowModal(false)
    }

    const handleInputChange = (e) => {
        setNewRoster({...newRoster, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
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
                    <BaseModal isOpen={showModal} onClose={handleOnClose}>
                        <form onSubmit={handleSubmit}>

                            <div>
                                <label>
                                    Week:
                                </label>
                                <input type="text" name="week" value={newRoster.week} onChange={handleInputChange}/>

                            </div>
                            <div>
                                <label>
                                    Year:
                                    <input type="text" name="year" value={newRoster.year} onChange={handleInputChange}/>
                                </label>
                            </div>
                            <div>
                                <label>
                                    Team Name:
                                    <input type="text" name="teamName" value={newRoster.teamName}
                                           onChange={handleInputChange}/>
                                </label>
                            </div>

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