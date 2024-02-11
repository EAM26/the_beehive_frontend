import React from 'react';
import Button from "../button/Button";
import {testRequest} from "../../service";


function Shift({start, end, employeeShortName, onClick}) {
    const formattedStart = start.substring(11, 16);
    const formattedEnd = end.substring(11, 16);

    const handleClick = async () => {
        try {
            const employees = await testRequest(); // Vervang door je eigen functie die de beschikbare werknemers ophaalt
        } catch (e) {
            console.error(e);
        }
    };


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
                            <Button onClick={handleClick} type="button" children="+Emp"/>
                        </td>
                    )}
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Shift;