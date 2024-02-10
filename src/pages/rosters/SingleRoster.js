import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {errorHandler} from "../../helpers/errorHandler";
import {getRoster} from "../../service";
import Shift from "../../components/shift/Shift";

function SingleRoster(props) {

    const {rosterId} = useParams()
    const {token} = useContext(AuthContext)
    const [shifts, setShifts] = useState([])
    const [singleRoster, setSingleRoster] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const rosterData = await getRoster(token, rosterId);
                setSingleRoster(rosterData)
                if (rosterData.shiftOutputDtos) {
                    setShifts(rosterData.shiftOutputDtos)
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
    return (
        <main className="outer-container">
            <div className="inner-container">
                {shifts ? shifts.map((shift) => {
                    return <div key={shift.id}>
                        <Shift
                        start={shift.startShift}
                        end={shift.endShift}
                        employeeShortName={shift.employeeShortName}

                        ></Shift>
                    </div>
                }) : ""}

            </div>
        </main>
    );
}

export default SingleRoster;