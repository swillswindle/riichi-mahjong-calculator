const CONSTANTS = require("../../resources/constants.js");
const sortingHelper = require("./sortingHelpers.js");
module.exports = {
  countDora(currentHand, dora) {
    for (let tile of dora) {
      switch (currentHand.tiles.filter((x) => x === tile).length) {
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
  },

  isOrphans(currentHand) {
    for (let tile of currentHand.tiles) {
      if (CONSTANTS.SIMPLES.includes(tile)) {
        return false;
      }
    }
    return new Set(currentHand.tiles).size === 13;
  },

  isSevenPairs(currentHand) {
    let tempHand = currentHand.tiles.slice();
    let pairCount = 0;
    for (let tile of tempHand) {
      if (tile === -1) {
        continue;
      }
      if (tempHand.filter((x) => x === tile).length === 2) {
        tempHand.splice(tempHand.indexOf(tile), 1);
        tempHand.splice(tempHand.indexOf(tile), 1);
        tempHand.unshift(-1, -1);
        pairCount++;
      }
    }
    if (pairCount === 7) {
      return true;
    } else {
      return false;
    }
  },

  //check to see if a seven pairs hand could actually be a ryanpeiko.
  isRyanpeiko(currentHand) {
    let possibleChi = [];

    for (let tile of currentHand.tiles) {
      sortingHelper.checkChi(currentHand, tile, possibleChi);
      console.log(possibleChi);
    }
    if (possibleChi.length >= 12) {
      //i'm not 100% this is surefire but i think it works. ryanpeiko is is the only other yaku that can be made with seven pairs. 2 of the same sequence in the same suit, twice.
      //cannot be 4 of the same sequence in the same suit.
      //check the test hand if that's confusing.
      //after some testing it seems like 12 is the minimum number of possible melds in a ryanpeiko.
      console.log(`Found a ryanpeiko`);

      return true;
    }
    console.log(`Not a ryanpeiko`);
    return false;
  },
};
