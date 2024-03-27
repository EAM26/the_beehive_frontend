import React from 'react';
import './Hexagon.css';
import button from "../button/Button";

function Hexagon({type, children, onClick, className}) {
    return (

        <button
            className={className}
            type={type}
            onClick={onClick}
        >
            {children}
        </button>
    );
}

export default Hexagon;