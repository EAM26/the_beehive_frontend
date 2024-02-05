import axios from "axios";



// Request to get all Users data with employee data
export const getUsers = async (token, signal) => {

    const response = await axios.get('http://localhost:8080/users',
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            signal: signal
        })
    console.log(response.data)
    return response.data

}

export const getSelf = async (token, signal) => {
    console.log("Running getSelf:")
    const response = await axios.get('http://localhost:8080/users/self',
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            signal: signal
        })
    console.log(response.data)
    return response.data

}

// Request for login
export const postLoginData = async(data) => {
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



export const getUserData = async (jwt, username)=> {
    // const authData  = await getAuthData(jwt)
    const response = await axios.get(`http://localhost:8080/users/${username}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
    })
    return response.data
}

export const createUser = async (jwt, username, password, userRole, email, isDeleted)=> {
    const response = await axios.post('http://localhost:8080/users', {

        username: username,
        password:  password,
        userRole: userRole,
        email: email,
        isDeleted: isDeleted,
    },{
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
    })
    return response.data
}
// export const updateUser = async (jwt, username, password, userRole, email, isDeleted)=> {
//     const response = await axios.put(`http://localhost:8080/users/${username}`, {
//
//         username: username,
//         password:  password,
//         userRole: userRole,
//         email: email,
//         isDeleted: isDeleted,
//     },{
//         headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${jwt}`
//         }
//     })
//     console.log(response)
//     return response.data
// }

export const createEmployee = async (jwt, firstName, preposition, lastName, shortName, dob, isActive, teamName, username)=> {
    const response = await axios.post('http://localhost:8080/employees', {
        firstName,
        preposition,
        lastName,
        shortName,
        dob,
        isActive,
        teamName,
        username

    },{
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
    })
    return response.data
}





