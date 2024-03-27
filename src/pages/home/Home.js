import React, {useState, useEffect, useContext} from 'react';
import {AuthContext} from "../../context/AuthContext";
import Hexagon from "../../components/hexagon/Hexagon";
import './Home.css';
import {NavLink} from "react-router-dom";

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
    function handleClick() {
        console.log("click");
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
        <div>
            {isAuth && (authLevel === 'admin' || authLevel === 'manager') && (
                <>
            <div className="hexagon-upper-row">
                <Hexagon
                    className="hexagonButton"
                    type="button"
                    onClick={handleClick}
                >
                    <NavLink to="/teams">
                        <h2>Teams</h2>
                    </NavLink>
                </Hexagon>
                <Hexagon
                    className="hexagonButton"
                    type="button"
                    onClick={handleClick}
                >
                    <NavLink to="/users">
                        <h2>Users</h2>
                    </NavLink>
                </Hexagon>
            </div>
            <div className="hexagon-lower-row">
                <Hexagon
                    className="hexagonButton"
                    type="button"
                    onClick={handleClick}
                >
                    <NavLink to="/rosters">
                        <h2>Rosters</h2>
                    </NavLink>
                </Hexagon>
                <Hexagon
                    className="hexagonButton"
                    type="button"
                    onClick={handleClick}
                >
                    <NavLink to="/profile">
                        <h2>Profile</h2>
                    </NavLink>
                </Hexagon>
            </div>
                </>
            )}
            {isAuth && authLevel === 'user' && (
                <div className="single-hex">
                    <Hexagon
                        className="hexagonButton"
                        type="button"
                        onClick={handleClick}
                    >
                        <NavLink to="/profile">
                            <h2>Profile</h2>
                        </NavLink>
                    </Hexagon>
                </div>
            )}
        </div>
        // <div className={"outer-container"}>
        //     <div className={"inner-container"}>
        //         <div className={styles["text-container"]}>
        //             <p className={`${styles["text-poem"]} ${styles["text-up"]}`}>{sentences[0]}</p>
        //             <p className={`${styles["text-poem"]} ${styles["text-left"]}`}>{sentences[3]}</p>
        //             <p className={`${styles["text-poem"]} ${styles["text-right"]}`}>{sentences[1]}</p>
        //             <div className={styles["hexagon-row"]}>
        //                 <Hexagon text="Rooster" onClick={handleClick}/>
        //                 <Hexagon text="Kaart" onClick={handleClick}/>
        //             </div>
        //             <Hexagon text="Kantoor" onClick={handleClick} className={styles["third-hexagon"]}/>
        //             <p className={`${styles["text-poem"]} ${styles["text-bottom"]}`}>{sentences[2]}
        //             </p>
        //         </div>
        //     </div>
        // </div>
    );
}

export default Home;
