import axios from "axios";


//Request to get all employees
export const getEmployees = async (token, signal) => {

    const response = await axios.get('http://localhost:8080/employees',
        {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            signal: signal
        })
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
export const getUserData = async (jwt) => {

    const response = await axios.get('http://localhost:8080/authenticated', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
        }
    })
    return response.data
}
