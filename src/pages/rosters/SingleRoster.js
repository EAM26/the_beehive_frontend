import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {errorHandler} from "../../helpers/errorHandler";
import {createShift, getRoster} from "../../service";
import DayColumn from "../../components/DayColumn/DayColumn";
import {LocaleContext} from "../../context/LocaleContext";
import "./SingleRoster.css"
import Shift from "../../components/shift/Shift";
import Button from "../../components/button/Button";
import BaseModal from "../../modals/BaseModal";
import {generateTimeOptions} from "../../helpers/timeFunctions";


function SingleRoster(props) {

    const {rosterId} = useParams()
    const {token} = useContext(AuthContext)
    const [shifts, setShifts] = useState([])
    const [singleRoster, setSingleRoster] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const userLocale = useContext(LocaleContext)
    const [showModal, setShowModal] = useState(false);
    const [newShift, setNewShift] = useState({
        start: '',
        end: '',
        date: {},
        teamName: ''
    })


    const handleNewShiftClick = (date) => {
        setNewShift({...newShift, date: date, teamName: singleRoster.teamName})
        console.log("handleNewShiftClick")
        setShowModal(true)
    }

    const handleClose = () => {
        setShowModal(false)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            await createShift(token, newShift.start, newShift.end, newShift.date, newShift.teamName);
        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
            console.error(e)
        } finally {
            setLoading(false)
        }
        setShowModal(false);
    };
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const rosterData = await getRoster(token, rosterId);
                setSingleRoster(rosterData)
                if (rosterData.shiftOutputDtos) {
                    setShifts(rosterData.shiftOutputDtos)
                }
            } catch (e) {
                setError(true);
                setErrormessage(errorHandler(e))
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        void fetchData()
    }, []);

    if (!singleRoster.weekDates) {
        return <div>Loading...</div>;
    }

    return (
        <main className="outer-container">
            <div className="inner-container">
                <div className="day-outer">
                    {loading && <p>Loading...</p>}
                    {singleRoster.weekDates.map((dateString) => {
                        const date = new Date(dateString);
                        const filteredShifts = shifts && shifts.filter((shift) => {
                            const shiftDate = shift.startShift.split('T')[0];
                            return shiftDate === dateString;
                        });
                        return (
                            <div key={dateString}>
                                <DayColumn date={date}>
                                    {/*{setNewShift({...newShift, date: date, teamName: singleRoster.teamName})}*/}
                                    {filteredShifts ? filteredShifts.map((shift) => {
                                        return <div key={shift.id}>
                                            <Shift
                                                start={shift.startShift}
                                                end={shift.endShift}
                                                employeeShortName={shift.employeeShortName}
                                            >
                                            </Shift>
                                        </div>
                                    }) : ""}
                                    <Button children="+shift" type="button" onClick={() => {
                                        handleNewShiftClick(date)
                                    }}/>
                                    {showModal && (
                                        <BaseModal isOpen={showModal} onClose={handleClose}>
                                            <form onSubmit={handleSubmit}>

                                                <div>
                                                    <label>
                                                        Start:
                                                        <select
                                                            name="start"
                                                            value={newShift.start}
                                                            onChange={e => setNewShift({
                                                                ...newShift,
                                                                start: e.target.value
                                                            })}>
                                                            {generateTimeOptions().map((time) => (
                                                                <option key={time} value={time}>{time}</option>
                                                            ))}
                                                        </select>
                                                    </label>
                                                </div>
                                                <div>
                                                    <label>
                                                        End:
                                                        <select
                                                            name="end"
                                                            value={newShift.end}
                                                            onChange={e => setNewShift({
                                                                ...newShift,
                                                                end: e.target.value
                                                            })}>
                                                            {generateTimeOptions().map((time) => (
                                                                <option key={time} value={time}>{time}</option>
                                                            ))}
                                                        </select>
                                                    </label>
                                                </div>

                                                <Button type="submit">Create</Button>
                                                {/*<Button type="button" onClick={handleOnClose}>Cancel</Button>*/}
                                            </form>
                                        </BaseModal>
                                    )}
                                </DayColumn>

                            </div>
                        );
                    })}


                </div>
            </div>
        </main>
    );
}

export default SingleRoster;