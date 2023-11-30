import axios from "axios";


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
