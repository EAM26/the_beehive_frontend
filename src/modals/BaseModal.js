import React from 'react';
import './CreationModal.css';

function BaseModal({isOpen, onClose, onSubmit, children}) {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal">
            <div className="modal-content">
                {children}
            </div>
        </div>
    );
}

export default BaseModal;