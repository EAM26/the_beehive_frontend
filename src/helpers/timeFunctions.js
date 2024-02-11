export function generateTimeOptions() {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const hourFormatted = hour.toString().padStart(2, '0');
            const minuteFormatted = minute.toString().padStart(2, '0');
            options.push(`${hourFormatted}:${minuteFormatted}`);
        }
    }
    return options;
}

export function formatShiftDateTime(date, time, adjustDay = false) {
    let timeAsString;
    if(time === "") {
        timeAsString = "00:00:00"
    } else {
        timeAsString = time += ":00";
    }

    const newDate = new Date(date);

    if (adjustDay) {
        newDate.setDate(newDate.getDate() + 1);
    }

    const year = newDate.getFullYear();
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const day = newDate.getDate().toString().padStart(2, '0');
    const formattedHours = timeAsString.substring(0, 2);
    const formattedMinutes = timeAsString.substring(3, 5);
    const formattedSeconds = timeAsString.substring(6, 8);


    let dateString = `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    console.log(dateString)
    return dateString;
}

// export function formatShiftDateTime(date, time, adjustDay = false) {
//     // Aannemende dat 'date' een Date object of een correct formaat string is
//     const newDate = typeof date === 'string' ? new Date(date) : new Date(date.getTime());
//
//     const [hoursStr, minutesStr] = time.split(':');
//     const hours = parseInt(hoursStr, 10);
//     const minutes = parseInt(minutesStr, 10);
//
//     // Zet de uren en minuten; corrigeer voor '00:00'
//     newDate.setHours(hours, minutes, 0, 0);
//
//     // Als adjustDay waar is en de tijd is '00:00', voeg dan een dag toe
//     if (adjustDay || (hours === 0 && minutes === 0 && time === '00:00')) {
//         newDate.setDate(newDate.getDate() + 1);
//     }
//
//     // Formatteer de nieuwe datum en tijd in "YYYY-MM-DDTHH:MM:SS" formaat
//     const year = newDate.getFullYear();
//     const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
//     const day = newDate.getDate().toString().padStart(2, '0');
//     const formattedHours = hours.toString().padStart(2, '0');
//     const formattedMinutes = minutes.toString().padStart(2, '0');
//
//     return `${year}-${month}-${day}T${formattedHours}:${formattedMinutes}:00`;
// }



