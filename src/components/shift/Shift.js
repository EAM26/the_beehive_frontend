import React, {useContext, useEffect, useState} from 'react';
import {createShift, getAvailableEmployees, testRequest, updateShift} from "../../service";
import {AuthContext} from "../../context/AuthContext";


function Shift({start, end, employeeShortName, children, shiftId, handleEmployeeChange }) {
    const formattedStart = start.substring(11, 16);
    const formattedEnd = end.substring(11, 16);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const { token } = useContext(AuthContext)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAvailableEmployees(token, shiftId);
                setAvailableEmployees(response)
            } catch (e) {
                console.error(e)
            }
        }
        void fetchData();
    }, []);



    if(!availableEmployees) {
        return <div>Loading....</div>
    }
    console.log(availableEmployees)

    return (
        <div>
            <table>
                <tbody>
                <tr>
                    <td>{formattedStart}</td>
                    <td>{formattedEnd}</td>
                    {employeeShortName ? (
                        <td>{employeeShortName}</td>
                    ) : (
                        <td>
                        <select onChange={handleEmployeeChange} defaultValue="">
                            <option value="" disabled>no emp</option>
                            {availableEmployees.map((emp) => (
                                <option key={emp.id} value={emp.id}>{emp.id} {emp.shortName}</option>
                            ))}
                        </select>
                        </td>
                    )}
                </tr>
                </tbody>
            </table>
            {children}
        </div>
    );
}

export default Shift;