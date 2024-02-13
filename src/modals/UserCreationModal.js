import { useState } from "react";
import '../components/baseModal/BaseModal.css';

function UserCreationModal({ isOpen, onClose, onSubmit }) {
    const [formDataUser, setFormDataUser] = useState({
        username: '',
        password: '',
        userRole: '',
        email: '',
        isDeleted: false,
    });

    const handleChangeUserField = (e) => {
        const {name, value, type, checked} = e.target;
        setFormDataUser(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmitUser = (e) => {
        e.preventDefault();
        onSubmit(formDataUser);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <form onSubmit={handleSubmitUser}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formDataUser.username}
                            onChange={handleChangeUserField}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formDataUser.password}
                            onChange={handleChangeUserField}
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formDataUser.email}
                            onChange={handleChangeUserField}
                        />
                    </div>
                    <div>
                        <label>User Role:</label>
                        <input
                            type="text"
                            name="userRole"
                            value={formDataUser.userRole}
                            onChange={handleChangeUserField}
                        />
                    </div>
                    <div>
                        <label>
                            Is Deleted:
                            <input
                                type="checkbox"
                                name="isDeleted"
                                checked={formDataUser.isDeleted}
                                onChange={handleChangeUserField}
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
