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





