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

    return dateString;
}





