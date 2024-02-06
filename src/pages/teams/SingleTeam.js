import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {getSingleTeam} from "../../service";
import {AuthContext} from "../../context/AuthContext";

function SingleTeam(props) {

    const {teamName} = useParams()
    const [team, setTeam] = useState({})
    const {token} = useContext(AuthContext);

    useEffect(() => {
        console.log("useEffect" + teamName)
        console.log("single team function")
        const fetchData = async () => {
            const controller = new AbortController();
            try {
                const response = await getSingleTeam(token, controller.signal, teamName);
                console.log("try block")
            } catch (e) {

            } finally {

            }
        }

        void fetchData();
    }, []);


    return (
        <main>
            <div>
                <p>SingleTeamPage</p>
            </div>
        </main>
    );
}

export default SingleTeam;