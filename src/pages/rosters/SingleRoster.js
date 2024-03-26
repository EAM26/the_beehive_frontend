import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {errorHandler} from "../../helpers/errorHandler";
import {createShift, deleteShift, getRoster, getShift, updateShift} from "../../service";
import DayColumn from "../../components/DayColumn/DayColumn";
import {LocaleContext} from "../../context/LocaleContext";
import "./SingleRoster.css"
import Shift from "../../components/shift/Shift";
import Button from "../../components/button/Button";
import BaseModal from "../../components/baseModal/BaseModal";
import {generateTimeOptions} from "../../helpers/timeFunctions";
import {mySorterTwoAttributes} from "../../helpers/mySorterFunctions";
import {PlusCircle, Trash, UserCircleMinus} from "@phosphor-icons/react";


function SingleRoster() {

    const {rosterId} = useParams()
    const {token} = useContext(AuthContext)
    const [shifts, setShifts] = useState([])
    const [singleRoster, setSingleRoster] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const userLocale = useContext(LocaleContext)
    const [showShiftModal, setShowShiftModal] = useState(false);
    const [newShift, setNewShift] = useState({
        start: '',
        end: '',
        date: {},
        teamName: ''
    })
    const [toggleFetch, setToggleFetch] = useState(false);

    const resetNewShift = () => {
        setNewShift({
            start: '',
            end: '',
            date: {},
            teamName: ''
        });
    };

    const handleDeleteEmployee = async (shiftId) => {
        console.log("This is the new emp delete method: ");
        try {
            const response = await getShift(token, shiftId)
            await updateShift(token, response, response.id, null)
            setToggleFetch(!toggleFetch);
            console.log(response)
        } catch (e) {
            console.error(e)
        }

    }


    const handleEmployeeChange = (shift, shiftId) => async (e) => {
        e.preventDefault();
        const selectedEmployeeId = e.target.value;
        console.log("handleEmployeeChange running")
        try {
            await updateShift(token, shift, shiftId, selectedEmployeeId);
        } catch (e) {

            console.error(e)
        } finally {
            setToggleFetch(!toggleFetch)
            console.log("new Emp: " + toggleFetch)
        }

    };


    const handleShiftDelete = async (shiftId) => {

        try {
            await deleteShift(token, shiftId);
        } catch (e) {
            console.error(e)
        } finally {
            setToggleFetch(!toggleFetch);
        }
    }


    const handleNewShiftClick = (date) => {
        setNewShift({...newShift, date: date, teamName: singleRoster.teamName})
        console.log("handleNewShiftClick")
        setShowShiftModal(true)
    }

    const handleClose = () => {
        setShowShiftModal(false)
    }
    const handleSubmit = async () => {
        setLoading(true)
        setError(false)
        setErrormessage("")
        try {
            await createShift(token, newShift.start, newShift.end, newShift.date, newShift.teamName);

        } catch (e) {
            setError(true);
            setErrormessage(errorHandler(e));
            console.error(e)
        } finally {
            resetNewShift()
            setLoading(false)
            setShowShiftModal(false);
        }

    };


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(false);
            setErrormessage("");
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
    }, [toggleFetch]);

    if (!singleRoster.weekDates) {
        return <div>Loading...</div>;
    }

    return (
        <main className="outer-container">
            <div className="inner-container">
                {loading && <p>Loading...</p>}
                <p className="error-message">{error ? errorMessage : ""}</p>
                <div className="single-roster-page">
                    <h2>{singleRoster.name}</h2>
                    <div className="week-outer">
                        {singleRoster.weekDates.map((dateString) => {
                            const date = new Date(dateString);
                            let filteredShifts = shifts && shifts.filter((shift) => {
                                const shiftDate = shift.startShift.split('T')[0];
                                return shiftDate === dateString;
                            });
                            filteredShifts = mySorterTwoAttributes(filteredShifts, 'startShift', 'endShift')
                            return (
                                <DayColumn key={dateString} date={date}>
                                    <div className="day-shifts">
                                        {filteredShifts ? filteredShifts.map((shift) => {
                                            return (
                                                <Shift
                                                    key={shift.id}
                                                    classname="shift-outer"
                                                    start={shift.startShift}
                                                    end={shift.endShift}
                                                    employeeShortName={shift.employeeShortName}
                                                    shiftId={shift.id}
                                                    shift={shift}
                                                    handleEmployeeChange={handleEmployeeChange(shift, shift.id)}
                                                    fetch={toggleFetch}
                                                >
                                                    <div className="shift-buttons">
                                                        {shift.employeeShortName &&
                                                            <Button
                                                                className="btn-logo"
                                                                type="button"
                                                                children={<UserCircleMinus size={20}/>}
                                                                onClick={() => {
                                                                    void handleDeleteEmployee(shift.id);
                                                                }}/>}
                                                        <Button
                                                            className="btn-logo"
                                                            type="button"
                                                            children={<Trash size={20}/>}
                                                            onClick={() => {
                                                                void handleShiftDelete(shift.id)
                                                            }}/>
                                                    </div>
                                                </Shift>
                                            );
                                        }) : ""}
                                        <Button className="btn-blue btn-shift"
                                                type="button"
                                                onClick={() => {
                                                    handleNewShiftClick(date)
                                                    // handleMyNewShiftClick(date)
                                                }}
                                        >
                                            <PlusCircle size={20}/>
                                            <p>Shift</p>
                                        </Button>
                                    </div>

                                </DayColumn>


                            );
                        })}
                    </div>
                </div>
            </div>
            {showShiftModal && (
                <BaseModal
                    isOpen={showShiftModal}
                    onClose={handleClose}>
                    <div className="modal">
                        <div className="modal-content">
                            <form onSubmit={handleSubmit}>

                                <div className="modal-item">
                                    <label>
                                        Start:
                                    </label>
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

                                </div>
                                <div className="modal-item">
                                    <label>
                                        End:
                                    </label>
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

                                </div>

                                <div className="modal-button-row">
                                    <Button className="btn-blue" type="submit">Create</Button>
                                    <Button className="btn-blue" type="button"
                                            onClick={handleClose}>Cancel</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </BaseModal>
            )}
        </main>
    );
}

export default SingleRoster;