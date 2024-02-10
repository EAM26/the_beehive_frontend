import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import {errorHandler} from "../../helpers/errorHandler";
import {getRoster} from "../../service";

function SingleRoster(props) {

    const {rosterId} = useParams()
    const {token} = useContext(AuthContext)
    const [singleRoster, setSingleRoster] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")


    useEffect(() => {
        const fetchData = async () => {
            console.log(rosterId)
            setLoading(true)
            try {
                const rosterData = await getRoster(token, rosterId);
                setSingleRoster(rosterData)
                console.log(rosterData)
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
                Test single roster
            </div>
        </main>
    );
}

export default SingleRoster;