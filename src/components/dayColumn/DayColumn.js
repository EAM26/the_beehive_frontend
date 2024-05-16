import React, {useContext} from 'react';
import {LocaleContext} from "../../context/LocaleContext";
import './DayColumn.css'
function DayColumn({ day, date, shifts, children, className}) {


    const userLocale = useContext(LocaleContext)


    const formattedDayMonth = date.toLocaleDateString(userLocale, {
        day: '2-digit',
        month: '2-digit',
    });

    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return (
        <div className="column">
            <div>
            <h3>{dayName.substring(0, 3)}</h3>
            <h3>{formattedDayMonth}</h3>
            </div>

            {children}

        </div>
    );
}

export default DayColumn;