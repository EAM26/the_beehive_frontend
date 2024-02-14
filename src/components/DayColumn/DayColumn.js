import React, {useContext} from 'react';
import {LocaleContext} from "../../context/LocaleContext";

function DayColumn({ day, date, shifts, children, }) {


    const userLocale = useContext(LocaleContext)


    const formattedDayMonth = date.toLocaleDateString(userLocale, {
        day: '2-digit',
        month: '2-digit',
    });

    const dayName = date.toLocaleDateString(userLocale, { weekday: 'long' });
    return (
        <div>
            <h3>{dayName.substring(0, 3)}</h3>
            <h3>{day}<span className="date">{formattedDayMonth}</span></h3>

            {children}
        </div>
    );
}

export default DayColumn;