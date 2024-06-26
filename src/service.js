import axios from "axios";
import {formatShiftDateTime} from "./helpers/timeFunctions";

export const getUsers = async (token, signal) => {

    const response = await axios.get('http://localhost:8080/users',
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            signal: signal
        })
    return response.data

}

export const getSelf = async (jwt, signal) => {
    const response = await axios.get('http://localhost:8080/users/self',
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwt}`
            },
            signal: signal
        })
    return response.data

}

// Request for login
export const postLoginData = async (data) => {
    const response = await axios.post(`http://localhost:8080/authenticate`, {
        username: data.username,
        password: data.password,
    })

    return response.data;
}

//Request to get user data
export const getAuthData = async (jwt) => {
    const response = await axios.get('http://localhost:8080/authenticated', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
    })

    return response.data
}


export const getUser = async (jwt, username) => {
    const response = await axios.get(`http://localhost:8080/users/${username}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
    })

    return response.data
}

export const createUser = async (jwt, username, password, userRole, email, isDeleted) => {
    const response = await axios.post('http://localhost:8080/users', {

        username: username,
        password: password,
        userRole: userRole,
        email: email,
        isDeleted: isDeleted,
    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
    })

    return response.data
}

export const updateUser = async (jwt, username, password, userRole, email, isDeleted) => {
    const checkedPassword = password === '' ? null : password
    const response = await axios.put(`http://localhost:8080/users/${username}`, {
        username: username,
        password: checkedPassword,
        userRole: userRole,
        email: email,
        isDeleted: isDeleted,
    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
    })

    return response.data
}

export const updateUserAsSelf = async (jwt, username, password, userRole, email, isDeleted) => {
    const checkedPassword = password === '' ? null : password
    const response = await axios.put("http://localhost:8080/users/self", {
        username: username,
        password: checkedPassword,
        userRole: userRole,
        email: email,
        isDeleted: isDeleted,
    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
    })

    return response.data
}

export const createEmployee = async (jwt, firstName, preposition, lastName, shortName, dob, isActive, phoneNumber, teamName, username) => {
    const response = await axios.post('http://localhost:8080/employees', {
        firstName,
        preposition,
        lastName,
        shortName,
        dob,
        isActive,
        phoneNumber,
        teamName,
        username

    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
    })

    return response.data
}
export const updateEmployee = async (jwt, id, firstName, preposition, lastName, shortName, dob, isActive, phoneNumber, teamName, username) => {


    const response = await axios.put(`http://localhost:8080/employees/${id}`, {
        firstName,
        preposition,
        lastName,
        shortName,
        dob,
        isActive,
        phoneNumber,
        teamName,
        username


    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
    })

    return response.data
}

export const getTeams = async (token, signal) => {

    const response = await axios.get('http://localhost:8080/teams',
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            signal: signal
        })

    return response.data
}

export const getSingleTeam = async (token, signal, teamName) => {
    const response = await axios.get(`http://localhost:8080/teams/${teamName}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            signal: signal
        })

    return response.data
}


export const createTeam = async (jwt, teamName, isActive) => {
    const response = await axios.post('http://localhost:8080/teams', {
        teamName,
        isActive
    }, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`
        },

    })

    return response.data
}

export const getRosters = async (token, signal) => {
    const response = await axios.get("http://localhost:8080/rosters", {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        signal: signal
    })

    return response.data
}

export const createRoster = async (token, week, year, teamName) => {
    const response = await axios.post("http://localhost:8080/rosters", {
        week,
        year,
        teamName,
    },{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })

    return response.data
}

export const getRoster = async (jwt, id) => {
    const response = await axios.get(`http://localhost:8080/rosters/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
    })

    return response.data
}

export const getShift = async (jwt, id) => {
    const response = await axios.get(`http://localhost:8080/shifts/${id}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
    })

    return response.data
}

export const createShift = async (token, start, end, date, teamName) => {
    const startShift = formatShiftDateTime(date, start)
    let endShift = formatShiftDateTime(date, end)
    if(startShift >= endShift) {
        endShift = formatShiftDateTime(date, end, true)
    }

    const response = await axios.post("http://localhost:8080/shifts", {
        startShift: startShift,
        endShift: endShift,
        teamName
    },{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })

    return response.data
}

export const createAbsence = async (token, startDate, endDate, employeeId) => {

    const response = await axios.post("http://localhost:8080/absences", {
        startDate,
        endDate,
        employeeId,
    },{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })

    return response.data
}

export const deleteShift = async (token, id) => {
    const response = await axios.delete(`http://localhost:8080/shifts/${id}` ,{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })

    return response.data
}

export const deleteAbsence = async (token, id) => {
    const response = await axios.delete(`http://localhost:8080/absences/${id}` ,{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })


    return response.data
}



export const getAvailableEmployees = async (token, id) => {

    const response = await axios.get(`http://localhost:8080/employees/shift/${id}`,{
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
    })


    return response.data
}

export const updateShift = async (token, shift, shiftId, employeeId, ) => {
    const response = await axios.put(`http://localhost:8080/shifts/${shiftId}`, {
        id: shiftId,
        startShift: shift.startShift,
        endShift: shift.endShift,
        employeeId,
        teamName: shift.teamName,
    }, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })


}

export const getCopyId = async (token, id) => {
    const response = await axios.get(`http://localhost:8080/image/${id}`,
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            responseType: 'blob'
        })

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file.pdf');
    document.body.appendChild(link);
    link.click();

    window.URL.revokeObjectURL(url);
    link.parentNode.removeChild(link);

    return response.data
}

export const createCopyId = async (token, formData) => {
    const response = await axios.post("http://localhost:8080/image", formData,{
        headers: {
            Authorization: `Bearer ${token}`
        },
    })

    return response.data
}

// Fake request to test calls to backend
export const testRequest = async (selectedEmployeeId, shiftId) => {

    return[]
}







