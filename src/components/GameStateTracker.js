import { React, useState, useRef, useEffect } from "react";
import Player from "./Player";
const GameStateTracker = () => {
  return (
    <div>
      <h1>Game State Tracker</h1>
      <div>
        <Player />
        <Player />
        <Player />
        <Player />
      </div>
    </div>
  );
};

export default GameStateTracker;
