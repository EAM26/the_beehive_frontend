import React from 'react';
import Button from "../button/Button";


function Shift({ start, end, employeeShortName, onClick }) {
    const formattedStart = start.substring(11, 16);
    const formattedEnd = end.substring(11, 16);
    return (
        <div >
            <span>{formattedStart}</span>
            <span>{formattedEnd}</span>
            <span>
                {employeeShortName ? (
                    <span>{employeeShortName}</span>
                ) : (
                    <Button onClick={onClick} type="button" children="+Emp"/>

                )}
            </span>
        </div>
    );
}

export default Shift;