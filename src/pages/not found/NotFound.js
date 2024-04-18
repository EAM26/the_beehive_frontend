import React, {useState} from 'react';
import './NotFound.css'
import {useNavigate} from "react-router-dom";
import chilling_bee from '../../assets/chilling_bee.png'

function NotFound(props) {

    const navigate = useNavigate();

    setTimeout(() => {
        navigate(-1);
    }, 3000);

    const [counter, setCounter] = useState(3);

    setInterval(() => {
        setCounter(counter - 1);
    }, 1000);


    return (
        <div className="outer-container">
            <div className="inner-container">
                <div className="not-found-page">
                    <span>404</span>
                    <img src={chilling_bee} alt="chilling bee image"/>

                </div>
            </div>
        </div>
    );
}

export default NotFound;