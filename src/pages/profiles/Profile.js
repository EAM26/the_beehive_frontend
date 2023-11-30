import React, {useEffect} from 'react';
import {getSingleEmployeeData, getUserData} from "../../service";

function Profile() {

    useEffect(() => {
        const token = localStorage.getItem('token');
        const fetchData = async () => {
            try {
                const userData = await getUserData(token)
                console.log(userData)
                const employeeData = await getSingleEmployeeData(token, userData.employeeId)
                console.log(employeeData)

            } catch (e) {
                console.error(e)

            }
        }
        void fetchData()
    }, []);

    return (
        <div>Test Profile</div>
    );
}

export default Profile;