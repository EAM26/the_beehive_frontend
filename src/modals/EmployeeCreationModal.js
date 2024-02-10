import React, {useContext, useEffect, useState} from "react";
import './CreationModal.css';
import {getTeams} from "../service";
import  {AuthContext} from "../context/AuthContext";
import Button from "../components/button/Button";

function EmployeeCreationModal({isOpen, onClose, onSubmit,}) {
    const [formData, setFormData] = useState({
        firstName: '',
        preposition: '',
        lastName: '',
        shortName: '',
        dob: '',
        phoneNumber: '',
        teamName: '',
        isActive: true,

    });

    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false)
    const {token} = useContext(AuthContext)

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
        onSubmit(formData);
        onClose();
    };

    useEffect(() => {
        const fetchData = (async () => {
            setLoading(true)
            try {
                const response = await getTeams(token);
                setTeams(response);
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }

        })
        void fetchData();
    }, []);

    if (!teams) {
        return <div>Loading...</div>;
    }

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Preposition:</label>
                        <input
                            type="text"
                            name="preposition"
                            value={formData.preposition}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Short Name:</label>
                        <input
                            type="text"
                            name="shortName"
                            value={formData.shortName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Date of Birth:</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Phone Number:</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Team</label>
                        <select  name="teamName" onChange={handleChange}>
                            {teams.map((team)=> {
                                return <option key={team.teamName} value={team.teamName}>{team.teamName}</option>
                            })}
                        </select>

                    </div>
                    <div>
                        <label>
                            Employee Active:
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <Button type="submit">Create Employee</Button>
                    <Button type="button" onClick={onClose}>Cancel</Button>
                </form>
            </div>
        </div>
    );
}

export default EmployeeCreationModal;
