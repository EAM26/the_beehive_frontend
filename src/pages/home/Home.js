import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from "../../context/AuthContext";
import Hexagon from "../../components/hexagon/Hexagon";
import './Home.css';
import {useNavigate} from "react-router-dom";

function Home() {

    const initialSentences = [
        "How doth the little busy bee",
        "Improve each shining hour,",
        "And gather honey all the day",
        "From every opening flower!",
        "How skilfully she builds her cell!",
        "How neat she spreads the wax!",
        "And labors hard to store it well",
        "With the sweet food she makes.",
        "In works of labor or of skill,",
        "I would be busy too;",
        "For Satan finds some mischief still",
        "For idle hands to do.",
        "In books, or work, or healthful play,",
        "Let my first years be passed,",
        "That I may give for every day",
        "Some good account at last."
    ];
    const [sentences, setSentences] = useState(initialSentences);
    const {isAuth, authLevel,} = useContext(AuthContext)
    const navigate = useNavigate();

    function handleClick(page) {
        navigate(page);
    }

    useEffect(() => {
        const intervalId = setInterval(() => {

            const updatedSentences = [...sentences.slice(1), sentences[0]];
            setSentences(updatedSentences);
        }, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, [sentences]);

    return (
        <div className="outer-container">
            <div className="inner-container">
                <div className="home-page">
                    <p className={`text-poem ${authLevel === 'admin' || authLevel === 'manager' ? 'text-up' : 'profile-text-up'}`}>{sentences[0]}</p>
                    <p className={`text-poem ${authLevel === 'admin' || authLevel === 'manager' ? 'text-left' : 'profile-text-left'}`}>{sentences[3]}</p>
                    <p className={`text-poem ${authLevel === 'admin' || authLevel === 'manager' ? 'text-right' : 'profile-text-right'}`}>{sentences[1]}</p>
                    {isAuth && (authLevel === 'admin' || authLevel === 'manager') && (
                        <>
                            <div className="hexagon-upper-row">
                                <Hexagon
                                    className="hexagonButton"
                                    type="button"
                                    onClick={() => {
                                        handleClick('/teams')
                                    }}

                                >
                                    <h2>Teams</h2>
                                </Hexagon>
                                <Hexagon
                                    className="hexagonButton"
                                    type="button"
                                    onClick={() => {
                                        handleClick('/users')
                                    }}
                                >
                                    <h2>Users</h2>
                                </Hexagon>
                            </div>
                            <div className="hexagon-lower-row">
                                <Hexagon
                                    className="hexagonButton"
                                    type="button"
                                    onClick={() => {
                                        handleClick('/rosters')
                                    }}
                                >
                                    <h2>Rosters</h2>
                                </Hexagon>
                                <Hexagon
                                    className="hexagonButton"
                                    type="button"
                                    onClick={() => {
                                        handleClick('/profile')
                                    }}
                                >
                                    <h2>Profile</h2>
                                </Hexagon>
                            </div>
                        </>
                    )}
                    <p className={`text-poem ${authLevel === 'admin' || authLevel === 'manager' ? 'text-bottom' : 'profile-text-bottom'}`}>{sentences[2]}</p>
                    {isAuth && authLevel === 'user' && (
                        <div className="single-hex">
                            <Hexagon
                                className="hexagonButton"
                                type="button"
                                onClick={() => {
                                    handleClick('/profile')
                                }}
                            >
                                <h2>Profile</h2>
                            </Hexagon>
                        </div>
                    )}
                </div>
            </div>
        </div>

    );
}

export default Home;
