import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {errorHandler} from "../../helpers/errorHandler";
import {getRoster} from "../../service";
import DayColumn from "../../components/DayColumn/DayColumn";
import {LocaleContext} from "../../context/LocaleContext";
import "./SingleRoster.css"
import Shift from "../../components/shift/Shift";


function SingleRoster(props) {

    const {rosterId} = useParams()
    const {token} = useContext(AuthContext)
    const [shifts, setShifts] = useState([])
    const [singleRoster, setSingleRoster] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const userLocale = useContext(LocaleContext)


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const rosterData = await getRoster(token, rosterId);
                setSingleRoster(rosterData)
                if (rosterData.shiftOutputDtos) {
                    setShifts(rosterData.shiftOutputDtos)
                    console.log(rosterData)
                    console.log(rosterData.shiftOutputDtos)
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
    console.log(singleRoster.weekDates)
    return (
        <main className="outer-container">
            <div className="inner-container">
                <div className="day-outer" >
                {loading && <p>Loading...</p>}
                {singleRoster.weekDates.map((dateString) => {
                    const date = new Date(dateString);
                    const filteredShifts = shifts && shifts.filter((shift) => {
                        const shiftDate = shift.startShift.split('T')[0];
                        return shiftDate === dateString;
                    });
                    return (
                        <div key={dateString}>
                            <DayColumn  date={date} >
                                {filteredShifts ? filteredShifts.map((shift) => {
                                    return <div key={shift.id}>
                                        <Shift
                                        start={shift.startShift}
                                        end={shift.endShift}
                                        employeeShortName={shift.employeeShortName}

                                        ></Shift>
                                    </div>
                                }) : ""}
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