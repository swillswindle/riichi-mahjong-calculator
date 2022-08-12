//yaku reference https://en.wikipedia.org/wiki/Japanese_mahjong_yaku
let tiles = require("../resources/tiles.json");
const CONSTANTS = require("../resources/constants.js");
const sortingHelper = require("./helpers/sortingHelpers");
const scoringHelper = require("./helpers/scoringHelpers");

//example hands/dora for testing
let testhand = [27, 27, 27, 0, 1, 2, 3, 34, 5, 6, 7, 8, 33, 33];
let testdora = [27, 3, 10];
// let sevenPairsTestHand = [1, 1, 10, 10, 19, 19, 28, 28, 3, 3, 12, 12, 21, 21];
// let ryanpeikoTestHand = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 30, 30];
// let badhand = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 0, 8];

//additional scoring relevant variables (incorporate into currentHand object?)
// let prevailingWind = 30;
// let seatWind = 30;
// let dealer = true;
// let ron = true;
let openHand = false;
// let winningTile = 33;
// let riichi = false;

function isHand(hand, dora) {
  //initialize hand object
  const currentHand = {
    tiles: [],
    kanCount: 0,
    pairCount: 0,
    ponCount: 0,
    chiCount: 0,
    doraCount: 0,
    melds: [[], [], [], [], []],
    currentMeld: 0,
    han: 0,
    fu: 0,
  };

  //populate tiles property with user input, swap out red fives, and count dora.
  currentHand.tiles = JSON.parse(JSON.stringify(hand));
  sortingHelper.replaceFives(currentHand);
  scoringHelper.countDora(currentHand, dora);
  //sort tiles by index from low to high
  currentHand.tiles.sort((a, b) => a - b);

  //quick checks for unusual hands
  if (scoringHelper.isOrphans(currentHand) && !openHand) {
    return "Thirteen Orphans";
  }
  if (scoringHelper.isSevenPairs(currentHand) && !openHand) {
    if (scoringHelper.isRyanpeiko(currentHand)) {
      return "Ryanpeiko";
    }
    return "Seven Pairs";
  }

  //go through all the tiles in hand and deal with just the honors.
  for (let tile of currentHand.tiles) {
    if (CONSTANTS.HONORS.includes(tile)) {
      //honors can't be in a chi, so we only need to look for pairs/pon/kan which are all mutually exclusive.
      //if we find any of those, we can lock them in right away.
      sortingHelper.checkHonors(currentHand, tile);
    }
  }
  //we already checked for seven pairs, so if we have more than one pair the hand is invalid.
  if (currentHand.pairCount > 1) {
    console.log("hand invalid");
    return false;
  }

  //now that honors are dealt with, loop through the remaining tiles and see what melds are possible.
  //if a given meld is the only possible meld for a given tile, we can add those tiles to the current meld and remove them from the hand.
  let possibleMelds = {
    chi: [],
    pon: [],
    kan: [],
    pairs: [],
  };

  let result = sortingHelper.reduceHand(currentHand, possibleMelds);
  sortingHelper.removeDupes(possibleMelds, currentHand);

  // while (result === 1) {
  //   result = reduceHand(currentHand, possibleMelds);
  //   removeDupes(possibleMelds, currentHand);
  // }

  if (result === 0) {
    //TODO: organize melds man, pin, sou, honors
    //if reduceHand returns 0, the hand should be good to go.
    console.log(`We got ourselves a hand baby:
    meld one:
    ${
      tiles[currentHand.melds[0][0]].value +
      " " +
      tiles[currentHand.melds[0][0]].suit
    }, ${
      tiles[currentHand.melds[0][1]].value +
      " " +
      tiles[currentHand.melds[0][1]].suit
    }, ${
      tiles[currentHand.melds[0][2]].value +
      " " +
      tiles[currentHand.melds[0][2]].suit
    } 
    meld two:
    ${
      tiles[currentHand.melds[1][0]].value +
      " " +
      tiles[currentHand.melds[1][0]].suit
    }, ${
      tiles[currentHand.melds[1][1]].value +
      " " +
      tiles[currentHand.melds[1][1]].suit
    }, ${
      tiles[currentHand.melds[1][2]].value +
      " " +
      tiles[currentHand.melds[1][2]].suit
    }
    meld three:
    ${
      tiles[currentHand.melds[2][0]].value +
      " " +
      tiles[currentHand.melds[2][0]].suit
    }, ${
      tiles[currentHand.melds[2][1]].value +
      " " +
      tiles[currentHand.melds[2][1]].suit
    }, ${
      tiles[currentHand.melds[2][2]].value +
      " " +
      tiles[currentHand.melds[2][2]].suit
    }
    meld four:
    ${
      tiles[currentHand.melds[3][0]].value +
      " " +
      tiles[currentHand.melds[3][0]].suit
    }, ${
      tiles[currentHand.melds[3][1]].value +
      " " +
      tiles[currentHand.melds[3][1]].suit
    }, ${
      tiles[currentHand.melds[3][2]].value +
      " " +
      tiles[currentHand.melds[3][2]].suit
    }
    and the pair:
    ${
      tiles[currentHand.melds[4][0]].value +
      " " +
      tiles[currentHand.melds[4][0]].suit
    }, ${
      tiles[currentHand.melds[4][1]].value +
      " " +
      tiles[currentHand.melds[4][1]].suit
    }
    `);
    return currentHand;
  }
  if (result === 2) {
    //if reduceHand returns 2, we couldn't reduce the hand any further, and we now need to call reducePossibleMelds to try to narrow down the possibliities.
    //we can try to simplify things a little more before we do though.
    //TODO: call reduce possible melds
    if (currentHand.pairCount === 0 && possibleMelds.pairs.length === 1) {
      currentHand.tiles.splice(
        currentHand.tiles.indexOf(possibleMelds.pairs[0][0]),
        1
      );
      currentHand.tiles.splice(
        currentHand.tiles.indexOf(possibleMelds.pairs[0][1]),
        1
      );
      currentHand.tiles.unshift(-1, -1);
      currentHand.melds[4].push(...possibleMelds.pairs.pop());
      currentHand.pairCount++;
    }
  }
}

isHand(testhand, testdora);
