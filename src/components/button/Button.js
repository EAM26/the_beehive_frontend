import React from 'react';

function Button({type, onClick, className, children, disabled}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default Button;