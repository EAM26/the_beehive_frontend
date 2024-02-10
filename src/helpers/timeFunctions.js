export function generateTimeOptions() {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            // Formatteer de uur en minuut naar strings met 2 cijfers
            const hourFormatted = hour.toString().padStart(2, '0');
            const minuteFormatted = minute.toString().padStart(2, '0');
            // Voeg de geformatteerde tijd toe aan de opties array
            options.push(`${hourFormatted}:${minuteFormatted}`);
        }
    }
    return options;
}
