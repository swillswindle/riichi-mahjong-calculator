// export function evaluateHand(hand) {
//   // determine if hand is a valid hand fitting the basic structure or one of the special hands
// }
let tiles = require("../../resources/tiles.json");
console.log(tiles.length);
let simples = [
  1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 28,
];
let honors = [30, 31, 32, 33, 34, 35, 36];
let man = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
let pin = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
let sou = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
let terminals = [0, 9, 10, 19, 20, 29];
let ones = [0, 10, 20]
let nines = [9, 19, 29]
let twos = [1, 11, 21];
let eights = [8, 18, 28];

function isHand(hand) {
  let melds = [[], [], [], [], []];
  let currentMeld = 0;
  let kanCount = 0;
  let pairCount = 0;
  let ponCount = 0;
  let chiCount = 0;

    for (let tile of hand) {
        if (honors.includes(tile)){
            hand.splice(hand.indexOf(tile), 1);
            melds[currentMeld].push(tile);
            if (currentMeld.length !== 0) {
                currentMeld++;
            }
            switch (hand.filter(handTile => handTile === tile).length) {
                case 0: 
                    return false;
                case 1:
                    melds[currentMeld].push(tile)
                    hand = hand.filter(handTile => handTile !== tile);
                    pairCount++;
                    currentMeld++;
                    break;
                case 2: 
                    melds[currentMeld].push(tile);
                    melds[currentMeld].push(tile);
                    hand = hand.filter(handTile => handTile !== tile);
                    ponCount++;
                    currentMeld++;
                    break;
                case 3:
                    melds[currentMeld].push(tile);
                    melds[currentMeld].push(tile);
                    melds[currentMeld].push(tile);
                    hand = hand.filter(handTile => handTile !== tile);
                    kanCount++;
                    currentMeld++;
                    break;
            }

        }
        else if (simples.includes(tile) || terminals.includes(tile)) {
            hand.splice(hand.indexOf(tile), 1);
            if (currentMeld.length !== 0) {
                currentMeld++;
            }
            melds[currentMeld].push(tile);
            switch (hand.filter(handTile => handTile === tile).length) {
                case 0: if (!nines.includes(tile) && !eights.includes(tiles) && hand.includes(tile + 1) && hand.includes(tile + 2)) {
                    melds[currentMeld].push(tile + 1);
                    melds[currentMeld].push(tile + 2);
                    hand = hand.filter(handTile => handTile !== tile + 1);
                    hand = hand.filter(handTile => handTile !== tile + 2);
                    chiCount++;
                    currentMeld++;
                    break;
                } else if (!ones.includes(tile) && !twos.includes(tile) && hand.includes(tile - 1) && hand.includes(tile - 2)) {
                    melds[currentMeld].push(tile - 1);
                    melds[currentMeld].push(tile - 2);
                    hand = hand.filter(handTile => handTile !== tile - 1);
                    hand = hand.filter(handTile => handTile !== tile - 2);
                    chiCount++;
                    currentMeld++;
                    break;
                } else if (!ones.includes(tile) && !nines.includes(tile) && hand.includes(tile -1) && hand.includes(tile + 1)) {
                    melds[currentMeld].push(tile - 1);
                    melds[currentMeld].push(tile + 1);
                    hand = hand.filter(handTile => handTile !== tile - 1);
                    hand = hand.filter(handTile => handTile !== tile + 1);
                    chiCount++;
                    currentMeld++;
                    break;
                } else {
                    return false;
                }
                

        }
    }}}

function isOrphans(hand) {
  for (let tile of hand) {
    if (simples.includes(tile)) {
      return false;
    }
  }
  return new Set(hand).size === 13;
}

let testhand = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33, 33];
let badhand = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 0, 8];

class Yaku {
  execute(yakuFunction) {
    yakuFunction();
  }
}

class Orphans extends Yaku {
  execute() {
    super.execute(() => {
      console.log("Orphans");
    });
  }
}
class SevenPairs extends Yaku {
  execute() {
    super.execute(() => {
      console.log("Seven Pairs");
    });
  }
}
class AllTerminals extends Yaku {
  execute() {
    super.execute(() => {
      console.log("All Terminals");
    });
  }
}

let test = new AllTerminals();
test.execute();
