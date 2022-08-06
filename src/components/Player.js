import React from "react";
import { useState, useRef, useEffect } from "react";

const Player = () => {
    let [score, setScore] = useState(25000)
    return (
        <div>
            <h1>Player</h1>
            <h2>Score:{score}</h2>
            <button>Declare Win</button>
            <button>Riichi</button>
        </div>

    )
}

export default Player;