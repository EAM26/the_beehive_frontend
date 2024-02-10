import React from 'react';

function BaseModal({isOpen, onClose, onSubmit, children}) {

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default BaseModal;