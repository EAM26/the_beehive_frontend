import React from 'react';
import './Hexagon.css';
import button from "../button/Button";

function Hexagon({type, text, onClick, className}) {
    return (

        // <button className={`${hexagonButton} ${className}`} type={type} onClick={onClick}>
        //     {text}
        // </button>

        <button className="hexagonButton" type="button">
            HexHex
        </button>
    );
}

export default Hexagon;