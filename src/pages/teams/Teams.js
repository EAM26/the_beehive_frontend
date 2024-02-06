import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/AuthContext";

function Teams(props) {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const {token} = useContext(AuthContext);


    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {

            } catch (e) {
                console.error(e)
            } finally {

            }

        }
    }, []);
    return (
        <main>
            <div>
                <h2>Teams</h2>
                {loading && <p>Loading...</p>}
                {error ? <p>{errorMessage}</p> : "to do"}
            </div>
        </main>
    );
}

export default Teams;