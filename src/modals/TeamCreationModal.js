import { useState } from "react";
import './CreationModal.css';

function TeamCreationModal({ isOpen, onClose, onSubmit,  }) {
    console.log("Team")
    const [formData, setFormData] = useState({
        teamName: '',
        isActive: true,

    });

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Team Name:</label>
                        <input
                            type="text"
                            name="teamName"
                            value={formData.teamName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>
                            Team Active:
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <button type="submit">Create Team</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default TeamCreationModal;
