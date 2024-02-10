import React from 'react';
import Button from "../button/Button";


function Shift({ start, end, employeeShortName, onClick }) {
    return (
        <div >
            <span>{start}</span>
            <span>{end}</span>
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