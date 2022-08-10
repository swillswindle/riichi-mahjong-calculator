// export function evaluateHand(hand) {
//   // determine if hand is a valid hand fitting the basic structure or one of the special hands
// }
import tiles from "./tiles";
console.log(tiles.length);
let simples = [
  1, 2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 19, 20, 21, 22, 23, 24, 25,
];
let honors = [27, 28, 29, 30, 31, 32, 33];
let man = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let pin = [9, 10, 11, 12, 13, 14, 15, 16, 17];
let sou = [18, 19, 20, 21, 22, 23, 24, 25, 26];
let terminals = [0, 8, 9, 17, 18, 26];
let ones = [0, 9, 18];
let nines = [8, 17, 26];
let twos = [1, 10, 19];
let eights = [7, 16, 25];
let redFives = [34, 35, 36];

let testhand = [27, 27, 27, 1, 2, 3, 4, 5, 6, 7, 8, 9, 33, 33];

function replaceFives(hand, currentHand) {
  for (let tile of hand) {
    switch (tile) {
      case 34:
        hand.splice(hand.indexOf(tile), 1);
        hand.push(4);
        currentHand.doraCount++;
        break;
      case 35:
        hand.splice(hand.indexOf(tile), 1);
        hand.push(13);
        currentHand.doraCount++;
        break;
      case 36:
        hand.splice(hand.indexOf(tile), 1);
        hand.push(22);
        currentHand.doraCount++;
        break;
      default:
        break;
    }
  }
}


function isHand(hand) {
  const currentHand = {
    tiles: [],
    kanCount: 0,
    pairCount: 0,
    ponCount: 0,
    chiCount: 0,
    doraCount: 0,
    melds: [[], [], [], [], []],
  };
  let currentMeld = 0;
  replaceFives(hand, currentHand);
  currentHand.tiles = JSON.parse(JSON.stringify(hand));
  console.log(hand, currentHand.tiles);

  for (let tile of currentHand.tiles) {
    if (tile === -1) {
      continue;
    }
    if (honors.includes(tile)) {
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.unshift(-1);
      if (currentHand.melds[currentMeld].length !== 0) {
        currentMeld++;
      }
      currentHand.melds[currentMeld].push(tile);

      console.log(`line 66: 
      honor tile: ${tile}
      currentMeld: ${currentMeld} ${currentHand.melds[currentMeld]}`);

      switch (
        currentHand.tiles.filter((handTile) => handTile === tile).length
      ) {
        case 0:
          return false;
        case 1:
          currentHand.melds[currentMeld].push(tile);
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.unshift(-1);
          currentHand.pairCount++;
          currentMeld++;
          break;
        case 2:
          currentHand.melds[currentMeld].push(tile);
          currentHand.melds[currentMeld].push(tile);
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.unshift(-1);
          currentHand.tiles.unshift(-1);

          currentHand.ponCount++;
          currentMeld++;
          break;
        case 3:
          currentHand.melds[currentMeld].push(tile);
          currentHand.melds[currentMeld].push(tile);
          currentHand.melds[currentMeld].push(tile);
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.unshift(-1);
          currentHand.tiles.unshift(-1);
          currentHand.tiles.unshift(-1);
          currentHand.kanCount++;
          currentMeld++;
          break;
      }

      console.log(`line 115: 
      honor tile: ${tile}
      currentMeld: ${currentMeld} ${currentHand.melds[currentMeld]}
      all melds: ${currentHand.melds}
      pairCount: ${currentHand.pairCount}
      ponCount: ${currentHand.ponCount}
      kanCount: ${currentHand.kanCount}
      chiCount: ${currentHand.chiCount}
      doraCount: ${currentHand.doraCount}`);
    } else if (simples.includes(tile) || terminals.includes(tile)) {
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
        currentHand.tiles.unshift(-1);
      if (currentHand.melds[currentMeld].length !== 0) {
        currentMeld++;
      }
      currentHand.melds[currentMeld].push(tile);

      switch (
        currentHand.tiles.filter((handTile) => handTile === tile).length
      ) {
        case 0:
          if (
            !nines.includes(tile) &&
            !eights.includes(tile) &&
            currentHand.tiles.includes(tile + 1) &&
            currentHand.tiles.includes(tile + 2)
          ) {
            currentHand.melds[currentMeld].push(tile + 1);
            currentHand.melds[currentMeld].push(tile + 2);
            currentHand.tiles.splice(currentHand.tiles.indexOf(tile + 1), 1);
            currentHand.tiles.splice(currentHand.tiles.indexOf(tile + 2), 1);
            currentHand.tiles.unshift(-1);
            currentHand.tiles.unshift(-1);
            currentHand.chiCount++;
            currentMeld++;
            break;
          } else if (
            !ones.includes(tile) &&
            !twos.includes(tile) &&
            currentHand.tiles.includes(tile - 1) &&
            currentHand.tiles.includes(tile - 2)
          ) {
            currentHand.melds[currentMeld].push(tile - 1);
            currentHand.melds[currentMeld].push(tile - 2);
            currentHand.tiles.splice(currentHand.tiles.indexOf(tile - 1), 1);
            currentHand.tiles.splice(currentHand.tiles.indexOf(tile - 2), 1);
            currentHand.tiles.unshift(-1);
            currentHand.tiles.unshift(-1);
            currentHand.chiCount++;
            currentMeld++;
            break;
          } else if (
            !ones.includes(tile) &&
            !nines.includes(tile) &&
            currentHand.tiles.includes(tile - 1) &&
            currentHand.tiles.includes(tile + 1)
          ) {
            currentHand.melds[currentMeld].push(tile - 1);
            currentHand.melds[currentMeld].push(tile + 1);
            currentHand.tiles.splice(currentHand.tiles.indexOf(tile - 1), 1);
            currentHand.tiles.splice(currentHand.tiles.indexOf(tile + 1), 1);
            currentHand.tiles.unshift(-1);
            currentHand.tiles.unshift(-1);
            currentHand.chiCount++;
            currentMeld++;
            break;
          } else {
            return false;
          }
      }
    }
  }
}
function isOrphans(hand) {
  for (let tile of hand) {
    if (simples.includes(tile)) {
      return false;
    }
  }
  return new Set(hand).size === 13;
}

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

isHand(testhand);
