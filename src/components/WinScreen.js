import React from "react";
import { useState, useRef, useEffect } from "react";

import tiles from "../resources/tiles.json";

const WinScreen = () => {
  const [man, openMan] = useState(false);
  const [pin, openPin] = useState(false);
  const [sou, openSou] = useState(false);
  const [honors, openHonors] = useState(false);
  const [hand, updateHand] = useState([]);
  const renderTiles = (tiles, displayTiles) => {
    if (displayTiles) {
      return tiles.map((tile, index) => {
        return (
          <div key={index}>
            <button
            disabled={hand.length === 14}
              onClick={() => {
                updateHand(hand.concat(tile));
              }}
            >
              {tile}
            </button>
          </div>
        );
      });
    }
  };
  const renderHand = () => {
    return hand.map((tile, index) => {
      return (
        <div key={index}>
          <button
            onClick={() => {
              updateHand(hand.filter((item, i) => i !== index));
            }}
          >
            {tile}
          </button>
        </div>
      );
    });
  };
  return (
    <div>
      <h1>Win Screen</h1>
      <div>
        <h1>
          My Hand:
          {renderHand()}
            <button disabled={hand.length !== 14}>
                Evaluate Hand
            </button>
        </h1>
        <div>
          <button onClick={() => openMan(!man)}>Man Tiles</button>
          <div>{renderTiles(tiles[0], man)}</div>
        </div>
        <div>
          <button onClick={() => openPin(!pin)}>Pin Tiles</button>
          <div>{renderTiles(tiles[1], pin)}</div>
        </div>
        <div>
          <button onClick={() => openSou(!sou)}>Sou Tiles</button>
          <div>{renderTiles(tiles[2], sou)}</div>
        </div>
        <div>
          <button onClick={() => openHonors(!honors)}>Honor Tiles</button>
          <div>{renderTiles(tiles[3], honors)}</div>
        </div>
        <button>Next Hand</button>
      </div>
    </div>
  );
};

export default WinScreen;
