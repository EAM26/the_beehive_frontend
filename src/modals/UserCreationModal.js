import {useState} from "react";
import './UserCreationModal.css'; // Adjust the path as necessary

function UserCreationModal({isOpen, onClose, onSubmit}) {
    console.log("test modal")
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        userRole: '',
        email: '',
        isDeleted: false,
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
        onClose(); // Close modal after submit
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <form onSubmit={handleSubmit}>

                    {/* Input fields for username, password, etc. */}
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>User Role:</label>
                        <input
                            type="text"
                            name="userRole"
                            value={formData.userRole}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>
                            Is Deleted:
                            <input
                                type="checkbox"
                                name="isDeleted"
                                checked={formData.isDeleted}
                                onChange={handleChange}
                            />
                        </label>
                    </div>
                    <button type="submit">Create User</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
}

export default UserCreationModal;
