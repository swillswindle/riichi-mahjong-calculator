// export function evaluateHand(hand) {
//   // determine if hand is a valid hand fitting the basic structure or one of the special hands
// }
let tiles = require("../../resources/tiles.json");

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

let testhand = [27, 27, 27, 0, 1, 2, 3, 4, 34, 6, 7, 8, 33, 33];
let testdora = [27, 3, 10];
let sevenPairsTestHand = [1, 1, 10, 10, 19, 19, 28, 28, 3, 3, 12, 12, 21, 21];
let ryanpeikoTestHand = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 30, 30];

let roundWind = 30;
let playerWind = 30;
let dealer = true;
let tsumo = false;
let ron = true;
let openHand = false;

function countDora(currentHand, dora) {
  for (let tile of dora) {
    switch (currentHand.tiles.filter((x) => x === tile).length) {
      case 0:
        break;
      case 1:
        currentHand.doraCount += 1;
        break;
      case 2:
        currentHand.doraCount += 2;
        break;
      case 3:
        currentHand.doraCount += 3;
        break;
      case 4:
        currentHand.doraCount += 4;
        break;
      default:
        break;
    }
  }
}

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

function checkHonors(currentHand, tile, currentMeld) {
  if (currentHand.melds[currentMeld].length !== 0) {
    currentMeld++;
  }

  switch (currentHand.tiles.filter((x) => x === tile).length - 1) {
    case 0:
      return false;
    case 1:
      currentHand.melds[4].push([tile, tile]);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.unshift(-1, -1);
      currentHand.pairCount++;
      currentMeld--;
      break;
    case 2:
      currentHand.melds[currentMeld].push(tile, tile, tile);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.unshift(-1, -1, -1);
      currentHand.ponCount++;
      break;
    case 3:
      currentHand.melds[currentMeld].push(tile, tile, tile, tile);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.unshift(-1, -1, -1, -1);
      currentHand.kanCount++;
      break;
  }
  console.log(`Found a meld for honor tile: ${tiles[tile].value}
  currentMeld: ${currentMeld} 
  currentMeld content: ${currentHand.melds[currentMeld]} (if this is empty, it's a pair)
  all melds: ${currentHand.melds}
  pairCount: ${currentHand.pairCount}
  ponCount: ${currentHand.ponCount}
  kanCount: ${currentHand.kanCount}
  chiCount: ${currentHand.chiCount}
  doraCount: ${currentHand.doraCount}
  incrementing currentMeld...`);
  currentMeld++;
}

function checkChi(currentHand, tile, possibleMelds) {
  if (
    !nines.includes(tile) &&
    !eights.includes(tile) &&
    currentHand.tiles.includes(tile + 1) &&
    currentHand.tiles.includes(tile + 2)
  ) {
    possibleMelds.push([tile, tile + 1, tile + 2]);
    // currentHand.melds[currentMeld].push(tile + 1);
    // currentHand.melds[currentMeld].push(tile + 2);
    // currentHand.tiles.splice(currentHand.tiles.indexOf(tile + 1), 1);
    // currentHand.tiles.splice(currentHand.tiles.indexOf(tile + 2), 1);
    // currentHand.tiles.unshift(-1);
    // currentHand.tiles.unshift(-1);
    // currentHand.chiCount++;
    // currentMeld++;
  }
  if (
    !ones.includes(tile) &&
    !twos.includes(tile) &&
    currentHand.tiles.includes(tile - 1) &&
    currentHand.tiles.includes(tile - 2)
  ) {
    possibleMelds.push([tile, tile - 1, tile - 2]);
    // currentHand.melds[currentMeld].push(tile - 1);
    // currentHand.melds[currentMeld].push(tile - 2);
    // currentHand.tiles.splice(currentHand.tiles.indexOf(tile - 1), 1);
    // currentHand.tiles.splice(currentHand.tiles.indexOf(tile - 2), 1);
    // currentHand.tiles.unshift(-1);
    // currentHand.tiles.unshift(-1);
    // currentHand.chiCount++;
    // currentMeld++;
  }
  if (
    !ones.includes(tile) &&
    !nines.includes(tile) &&
    currentHand.tiles.includes(tile - 1) &&
    currentHand.tiles.includes(tile + 1)
  ) {
    possibleMelds.push([tile, tile - 1, tile + 1]);
    // currentHand.melds[currentMeld].push(tile - 1);
    // currentHand.melds[currentMeld].push(tile + 1);
    // currentHand.tiles.splice(currentHand.tiles.indexOf(tile - 1), 1);
    // currentHand.tiles.splice(currentHand.tiles.indexOf(tile + 1), 1);
    // currentHand.tiles.unshift(-1);
    // currentHand.tiles.unshift(-1);
    // currentHand.chiCount++;
    // currentMeld++;
  }
}

function isHand(hand, dora) {
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
  countDora(currentHand, dora);

  console.log(hand, currentHand.tiles);

  for (let tile of currentHand.tiles) {
    if (tile === -1) {
      continue;
    }
    if (honors.includes(tile)) {
      checkHonors(currentHand, tile, currentMeld);
    } else {
      continue;
    }
  }

  if (currentHand.pairCount > 1) {
    console.log('hand invalid')
    return false;
  }

  for (let tile of currentHand.tiles) {
    if (tile === -1) {
      continue;
    }
    if (simples.includes(tile) || terminals.includes(tile)) {
      let possibleMelds = [];
      if (currentHand.melds[currentMeld].length !== 0) {
        currentMeld++;
      }

      switch (currentHand.tiles.filter((x) => x === tile).length) {
        case 0:
          checkChi(currentHand, tile, possibleMelds);

          if (possibleMelds.length === 1) {
            currentHand.melds[currentMeld].push(...possibleMelds[0]);
            currentHand.tiles.splice(
              currentHand.tiles.indexOf(possibleMelds[0][0]),
              1
            );
            currentHand.tiles.splice(
              currentHand.tiles.indexOf(possibleMelds[0][1]),
              1
            );
            currentHand.tiles.splice(
              currentHand.tiles.indexOf(possibleMelds[0][2]),
              1
            );
            currentHand.tiles.unshift(-1, -1, -1);
            currentHand.chiCount++;
            currentMeld++;

            console.log(`Found a meld for tile: ${tiles[tile].value} ${tiles[tile].suit}
            currentMeld: ${currentMeld}
            currentMeld content: ${currentHand.melds[currentMeld]}
            all melds: ${currentHand.melds}
            pairCount: ${currentHand.pairCount}
            ponCount: ${currentHand.ponCount}
            kanCount: ${currentHand.kanCount}
            chiCount: ${currentHand.chiCount}
            doraCount: ${currentHand.doraCount}`);

            break;
          }
          if (possibleMelds.length > 1) {
            for (let meld of possibleMelds) {
              let remainingTiles = JSON.parse(
                JSON.stringify(currentHand.tiles)
              );
              remainingTiles.splice(remainingTiles.indexOf(meld[0]), 1);
              remainingTiles.splice(remainingTiles.indexOf(meld[1]), 1);
              remainingTiles.splice(remainingTiles.indexOf(meld[2]), 1);
              remainingTiles.unshift(-1, -1, -1);
              console.log(remainingTiles);
              //the idea here would be to look at the tiles that would remain after the meld would be made and see if the rest of the tiles can be worked into melds, or a pair if there isn't one.
              // if we can't make the rest of the tiles work, then we can toss this possible meld and move on to the next one.
              if (currentHand.pairCount === 1) {
                //if we already know the pair then we only have to look for pon/kan/chi
                //idr exactly how kan works scoring wise but it might be prudent to see if we can do something with kans similar to how we dealt with the red fives.
              }
              if (currentHand.pairCount === 0) {
                //if we don't have a pair yet, the remaining tiles must contain a pair
            }
          }
          } else {
            return false;
          }
        case 1:
          checkChi(currentHand, tile, possibleMelds);
          if (possibleMelds.length === 0) {
            currentHand.melds[4].push([tile, tile]);
            currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
            currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
            currentHand.tiles.unshift(-1, -1);
            currentHand.pairCount++;
          }
      }
    }
  }
}

function isSevenPairs(hand) {
  let pairCount = 0;
  let currentHand = {
    tiles: [],
  };
  currentHand.tiles = JSON.parse(JSON.stringify(hand));
  for (let tile of hand) {
    if (tile === -1) {
      continue;
    }
    if (hand.filter((x) => x === tile).length === 2) {
      hand.splice(hand.indexOf(tile), 1);
      hand.splice(hand.indexOf(tile), 1);
      hand.unshift(-1, -1);
      pairCount++;
    }
  }
  if (pairCount === 7) {
    let possibleMelds = [];
    console.log(
      `Found Seven Pairs. Checking to see if it could be ryanpeiko...`
    );
    for (let tile of currentHand.tiles) {
      checkChi(currentHand, tile, possibleMelds);
      console.log(possibleMelds);
    }
    if (possibleMelds.length >= 12) {
      //i'm not 100% this is surefire but i think it works. ryanpeiko is is the only other yaku that can be made with seven pairs. 2 of the same sequence in the same suit, twice. 
      //check the test hand if that's confusing.
      console.log(`Found a ryanpeiko`);
    
      return "Ryanpeiko";
    }
    console.log(`Not a ryanpeiko`);
    return "Seven Pairs";
  }
  return false;
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
// isSevenPairs(sevenPairsTestHand);
// isSevenPairs(ryanpeikoTestHand);
isHand(testhand, testdora);
