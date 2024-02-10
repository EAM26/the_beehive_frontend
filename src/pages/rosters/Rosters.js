import React, {useContext, useEffect, useState} from 'react';
import {errorHandler} from "../../helpers/errorHandler";
import {AuthContext} from "../../context/AuthContext";
import {getRosters} from "../../service";
import Button from "../../components/button/Button";
import {sortRostersByYearAndWeek} from "../../helpers/mySorterFunctions";
import BaseModal from "../../modals/BaseModal";
import {set} from "react-hook-form";

function Rosters(props) {

    const [rosters, setRosters] = useState([])
    const {token} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false);
    const [errorMessage, setErrormessage] = useState("")
    const [showModal, setShowModal] = useState(false);
    const [newRoster, setNewRoster] = useState({
        week: '',
        year: '',
        teamName: ''
    });

    const handleInputChange = (e) => {
        setNewRoster({ ...newRoster, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(newRoster);
        setShowModal(false);
    };


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
    }, []);

    console.log(rosters)
    return (
       <main className="outer-container">
       <div className="inner-container">
           <h2>Rosters</h2>
           <Button children="NEW ROSTER" type="button" onClick={() => setShowModal(true)}/>
           {showModal && (
               <BaseModal isOpen={showModal} onClose={() => setShowModal(false)}>
                   <form onSubmit={handleSubmit}>

                       <div>
                           <label>
                           Week:
                           </label>
                           <input type="text" name="week" value={newRoster.week} onChange={handleInputChange} />

                       </div>
                       <div>
                           <label>
                               Year:
                               <input type="text" name="year" value={newRoster.year} onChange={handleInputChange} />
                           </label>
                       </div>
                       <div>
                           <label>
                               Team Name:
                               <input type="text" name="teamname" value={newRoster.teamname} onChange={handleInputChange} />
                           </label>
                       </div>

                       <Button type="submit">Add Roster</Button>
                   </form>
               </BaseModal>
           )}
           {loading && <p>Loading...</p>}
           {error ? <p>{errorMessage}</p> :

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
                       <td><Button children="view"/></td>
                   </tr>
               })}

               </tbody>
           </table>}
       </div>
       </main>
    );
}

export default Rosters;