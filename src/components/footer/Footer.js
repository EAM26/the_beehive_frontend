import React from 'react';
import "./Footer.css"
import {Copyright} from "@phosphor-icons/react";

function Footer(props) {
    return (

        <div className="footer">
            <p><Copyright size={20}/>2024 EA Muller Holding B.V.</p>
        </div>

    );
}

export default Footer;