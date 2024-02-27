import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {errorHandler} from "../../helpers/errorHandler";
import {createShift, deleteShift, getRoster, updateShift} from "../../service";
import DayColumn from "../../components/DayColumn/DayColumn";
import {LocaleContext} from "../../context/LocaleContext";
import "./SingleRoster.css"
import Shift from "../../components/shift/Shift";
import Button from "../../components/button/Button";
import BaseModal from "../../components/baseModal/BaseModal";
import {generateTimeOptions} from "../../helpers/timeFunctions";
import {mySorterTwoAttributes} from "../../helpers/mySorterFunctions";


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
    const [newEmp, setNewEmp] = useState(false)
    const [isDelete, setIsDelete] = useState(false)

    const resetNewShift = () => {
        setNewShift({
            start: '',
            end: '',
            date: {},
            teamName: ''
        });
    };

    const handleEmployeeChange = (shift, shiftId) => async (e) => {
        e.preventDefault();
        const selectedEmployeeId = e.target.value;
        console.log("handleEmployeeChange running")
        try {
            await updateShift(token, shift, shiftId, selectedEmployeeId );
        } catch (e) {

            console.error(e)
        } finally {
            setNewEmp(!newEmp)
            console.log("new Emp: " + newEmp)
        }

    };


    const handleShiftDelete = async (shiftId) => {

        try {
            await deleteShift(token, shiftId);
        } catch (e) {
            console.error(e)
        } finally {
            setIsDelete(!isDelete);
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
        }finally {
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
    }, [newEmp, isDelete]);

    if (!singleRoster.weekDates) {
        return <div>Loading...</div>;
    }

    return (
        <main className="outer-container">
            <div className="inner-container">
                {loading && <p>Loading...</p>}
                <p className="error-message">{error ? errorMessage: ""}</p>
                <h3>{singleRoster.name}</h3>
                <div className="day-outer">

                    {singleRoster.weekDates.map((dateString) => {
                        const date = new Date(dateString);
                        let filteredShifts = shifts && shifts.filter((shift) => {
                            const shiftDate = shift.startShift.split('T')[0];
                            return shiftDate === dateString;
                        });
                        filteredShifts = mySorterTwoAttributes(filteredShifts, 'startShift', 'endShift')
                        return (
                            <div key={dateString}>
                                <DayColumn date={date}>
                                    {filteredShifts ? filteredShifts.map((shift) => {
                                        return <div key={shift.id}>
                                            <Shift
                                                start={shift.startShift}
                                                end={shift.endShift}
                                                employeeShortName={shift.employeeShortName}
                                                shiftId={shift.id}
                                                shift = {shift}
                                                handleEmployeeChange={handleEmployeeChange(shift, shift.id)}
                                                newEmp={newEmp}
                                            >
                                                <Button children="Del" onClick={() => {
                                                    void handleShiftDelete(shift.id)
                                                }}/>
                                            </Shift>
                                        </div>
                                    }) : ""}
                                    <Button children="+shift" type="button" onClick={() => {
                                        handleNewShiftClick(date)
                                    }}/>
                                    {showShiftModal && (
                                        <BaseModal isOpen={showShiftModal} onClose={handleClose}>
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
                                                <Button type="button" onClick={handleClose}>Cancel</Button>
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