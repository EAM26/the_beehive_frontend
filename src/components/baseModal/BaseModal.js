import React from 'react';
import './BaseModal.css';

function BaseModal({isOpen, onClose, onSubmit, children}) {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content" onClose={onClose} onClick={onSubmit}>
                {children}
            </div>
        </div>
    );
}

export default BaseModal;