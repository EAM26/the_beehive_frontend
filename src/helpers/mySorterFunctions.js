export function sortRostersByYearAndWeek(rosters) {
    return rosters.sort((a, b) => {
        // Split the name into parts: [week, year, teamName]
        const partsA = a.name.split('-');
        const partsB = b.name.split('-');

        // Parse integers from the year and week parts
        const yearA = parseInt(partsA[1], 10);
        const weekA = parseInt(partsA[0], 10);
        const yearB = parseInt(partsB[1], 10);
        const weekB = parseInt(partsB[0], 10);

        // Compare years first
        if (yearA !== yearB) {
            return yearA - yearB;
        }
        // If years are equal, compare weeks
        return weekA - weekB;
    });
}

export function mySorterIgnoreCaseSingleAttr(myArray, attribute) {
    return myArray.sort((a, b) => a[attribute].localeCompare(b[attribute], undefined, {sensitivity: 'base'}))
}

export function mySorterIgnoreCase(myArray) {
    return myArray.sort((a, b) => a.localeCompare(b, undefined, {sensitivity: 'base'}))
}



export function mySorterTwoAttributes(myArray, primaryAttribute, secondaryAttribute) {
    return myArray.sort((a, b) => {
        if (a[primaryAttribute] < b[primaryAttribute]) {
            return -1;
        }
        if (a[primaryAttribute] > b[primaryAttribute]) {
            return 1;
        }
        if (secondaryAttribute) {
            if (a[secondaryAttribute] < b[secondaryAttribute]) {
                return -1;
            }
            if (a[secondaryAttribute] > b[secondaryAttribute]) {
                return 1;
            }
        }
        return 0;
    });
}


