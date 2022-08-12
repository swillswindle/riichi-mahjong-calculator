//replace red fives with regular fives for simplicity in sorting the hand and increment dora count for each red five
const CONSTANTS = require("../../resources/constants.js");
let tiles = require("../../resources/tiles.json");
let utils = require("../utils/utils.js");

module.exports = {
  replaceFives(currentHand) {
    for (let tile of currentHand.tiles) {
      switch (tile) {
        case 34:
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.unshift(4);
          currentHand.doraCount++;
          break;
        case 35:
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.unshift(13);
          currentHand.doraCount++;
          break;
        case 36:
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.unshift(22);
          currentHand.doraCount++;
          break;
        default:
          break;
      }
    }
  },

  checkHonors(currentHand, tile) {
    switch (currentHand.tiles.filter((x) => x === tile).length) {
      case 1:
        return false;
      case 2:
        currentHand.melds[4].push(tile, tile);
        utils.spliceAndUnshift(currentHand, tile, 2);
        currentHand.pairCount++;
        currentHand.currentMeld--;
        break;
      case 3:
        currentHand.melds[currentHand.currentMeld].push(tile, tile, tile);
        utils.spliceAndUnshift(currentHand, tile, 3);
        currentHand.ponCount++;
        break;
      case 4:
        currentHand.melds[currentHand.currentMeld].push(tile, tile, tile, tile);
        utils.spliceAndUnshift(currentHand, tile, 4);
        currentHand.kanCount++;
        break;
      default:
        break;
    }
    console.log(`Found a meld for honor tile: ${tiles[tile].value}
    currentMeld: ${currentHand.currentMeld} 
    currentMeld content: ${
      currentHand.melds[currentHand.currentMeld]
    } (if this is empty, it's a pair)
    all melds: ${currentHand.melds}
    pairCount: ${currentHand.pairCount}
    ponCount: ${currentHand.ponCount}
    kanCount: ${currentHand.kanCount}
    chiCount: ${currentHand.chiCount}
    doraCount: ${currentHand.doraCount}
    incrementing currentMeld...`);
    currentHand.currentMeld++;
  },

  checkChi(currentHand, tile, possibleChi) {
    if (
      !CONSTANTS.NINES.includes(tile) &&
      !CONSTANTS.EIGHTS.includes(tile) &&
      currentHand.tiles.includes(tile + 1) &&
      currentHand.tiles.includes(tile + 2)
    ) {
      possibleChi.push([tile, tile + 1, tile + 2]);
    }
    if (
      !CONSTANTS.ONES.includes(tile) &&
      !CONSTANTS.TWOS.includes(tile) &&
      currentHand.tiles.includes(tile - 1) &&
      currentHand.tiles.includes(tile - 2)
    ) {
      possibleChi.push([tile - 2, tile - 1, tile]);
    }
    if (
      !CONSTANTS.ONES.includes(tile) &&
      !CONSTANTS.NINES.includes(tile) &&
      currentHand.tiles.includes(tile - 1) &&
      currentHand.tiles.includes(tile + 1)
    ) {
      possibleChi.push([tile - 1, tile, tile + 1]);
    }
  },

  removeDupes(possibleMelds, currentHand) {
    if (possibleMelds.chi.length > 0) {
      for (let meld of possibleMelds.chi) {
        if (meld.includes(-1)) {
          continue;
        }
        for (let i = 0, len = possibleMelds.chi.length; i < len; i++) {
          if (JSON.stringify(possibleMelds.chi[i]) === JSON.stringify(meld)) {
            if (
              currentHand.tiles.filter((x) => x === meld[0]).length > 1 &&
              currentHand.tiles.filter((x) => x === meld[1]).length > 1 &&
              currentHand.tiles.filter((x) => x === meld[2]).length > 1
            ) {
              continue;
            } else {
              possibleMelds.chi.splice(i, 1);
              possibleMelds.chi.push([-1]);
            }
          }
        }
      }
    }

    if (possibleMelds.pon.length > 0) {
      for (let meld of possibleMelds.pon) {
        if (meld.includes(-1)) {
          continue;
        }
        for (let i = 0, len = possibleMelds.pon.length; i < len; i++) {
          if (possibleMelds.pon[i] === meld) {
            possibleMelds.pon.splice(i, 1);
            possibleMelds.pon.push([-1]);
          }
        }
      }
    }
    if (possibleMelds.kan.length > 0) {
      for (let meld of possibleMelds.kan) {
        if (meld.includes(-1)) {
          continue;
        }
        for (let i = 0, len = possibleMelds.kan.length; i < len; i++) {
          if (possibleMelds.kan[i] === meld) {
            possibleMelds.kan.splice(i, 1);
            possibleMelds.kan.push([-1]);
          }
        }
      }
    }
    if (possibleMelds.pairs.length > 0) {
      for (let meld of possibleMelds.pairs) {
        if (meld.includes(-1)) {
          continue;
        }
        for (let i = 0, len = possibleMelds.kan.length; i < len; i++) {
          if (possibleMelds.kan[i] === meld) {
            possibleMelds.kan.splice(i, 1);
            possibleMelds.kan.push([-1]);
          }
        }
      }
    }
  },

  reducePossibleMelds(possibleMelds, currentHand) {
    if (possibleMelds.chi.length > 0) {
      for (let meld of possibleMelds.chi) {
        let remainingTiles = JSON.parse(JSON.stringify(currentHand.tiles));
        remainingTiles.splice(remainingTiles.indexOf(meld[0]), 1);
        remainingTiles.splice(remainingTiles.indexOf(meld[1]), 1);
        remainingTiles.splice(remainingTiles.indexOf(meld[2]), 1);
        remainingTiles.unshift(-1, -1, -1);
        console.log(remainingTiles);
        if (currentHand.pairCount === 1) {
          //if we already know the pair then we only have to look for pon/kan/chi
          //idr exactly how kan works scoring wise but it might be prudent to see if we can do something with kans similar to how we dealt with the red fives.
        }
        if (currentHand.pairCount === 0) {
          //if we don't have a pair yet, the remaining tiles must contain a pair
        }
      }
    }
    if (possibleMelds.pon.length > 0) {
      for (let meld of possibleMelds.pon) {
        let remainingTiles = currentHand.tiles.filter((x) => x !== meld[0]);
        remainingTiles.unshift(-1, -1, -1);
      }
    }
    if (possibleMelds.kan.length > 0) {
      for (let meld of possibleMelds.kan) {
        let remainingTiles = currentHand.tiles.filter((x) => x !== meld[0]);
        remainingTiles.unshift(-1, -1, -1, -1);
      }
    }
  },

  reduceHand(currentHand, possibleMelds) {
    let unsortedCount = currentHand.tiles.filter((x) => x !== -1).length;
    for (let tile of currentHand.tiles) {
      let possibleChi = [];

      if (tile === -1) {
        continue;
      }
      //# of duplicate tiles in array
      switch (currentHand.tiles.filter((x) => x === tile).length) {
        case 1:
          //we know this tile cannot be a pair/pon/kan, so it must be part of a chi.
          this.checkChi(currentHand, tile, possibleChi);
          if (possibleChi.length === 0) {
            //if no chi can be made, the hand is invalid.
            return false;
          }
          if (possibleChi.length === 1) {
            //if the tile only fits into one meld, that meld must be part of the hand.
            //add those tiles to the current meld, then remove the tiles from the hand and increment currentMeld.
            currentHand.tiles.splice(
              currentHand.tiles.indexOf(possibleChi[0][0]),
              1
            );
            currentHand.tiles.splice(
              currentHand.tiles.indexOf(possibleChi[0][1]),
              1
            );
            currentHand.tiles.splice(
              currentHand.tiles.indexOf(possibleChi[0][2]),
              1
            );
            currentHand.tiles.unshift(-1, -1, -1);
            currentHand.melds[currentHand.currentMeld].push(
              possibleChi[0][0],
              possibleChi[0][1],
              possibleChi[0][2]
            );
            currentHand.chiCount++;

            console.log(`Found a Chi!
              tile: ${tiles[tile].value} ${tiles[tile].suit}
              currentMeld: ${currentHand.currentMeld}
              currentMeld content: ${currentHand.melds[currentHand.currentMeld]}
              all melds: ${currentHand.melds}
              pairCount: ${currentHand.pairCount}
              ponCount: ${currentHand.ponCount}
              kanCount: ${currentHand.kanCount}
              chiCount: ${currentHand.chiCount}
              doraCount: ${currentHand.doraCount}
              incrementing current meld...`);
            currentHand.currentMeld++;
            break;
          }
          //if a tile fits into more than one meld, don't do anything other than adding those melds to possibleMelds obj. for now, we just want to identify all tiles that only fit into one meld.
          else {
            possibleMelds.chi.push(...possibleChi);
            break;
          }

        case 2:
          this.checkChi(currentHand, tile, possibleChi);
          if (possibleChi.length === 0) {
            //if we have two of a given tile, and that tile does not fit into a chi, it must be a pair.
            if (currentHand.pairCount > 0) {
              //if we already have a pair, the hand is invalid.
              return false;
            }
            //if not, then add the tiles to the pair meld (index 4), remove the tiles from the hand, then increment the pair count.
            currentHand.melds[4].push(tile, tile);
            utils.spliceAndUnshift(currentHand, tile, 2);
            currentHand.pairCount++;

            console.log(`Found a pair! 
            tile: ${tiles[tile].value} ${tiles[tile].suit}
            currentMeld: ${currentHand.currentMeld} 
            meld pair content: ${currentHand.melds[4]}
            all melds: ${currentHand.melds}
            pairCount: ${currentHand.pairCount}
            ponCount: ${currentHand.ponCount}
            kanCount: ${currentHand.kanCount}
            chiCount: ${currentHand.chiCount}
            doraCount: ${currentHand.doraCount}`);
            break;
          }
          if (possibleChi.length === 1) {
            if (currentHand.pairCount === 1) {
              //if we already know the pair, and there's only one possible chi, then that chi must be one of the melds.
              //remove tiles from hand, pop out the meld and spread it into the current meld.
              currentHand.tiles.splice(
                currentHand.tiles.indexOf(possibleChi[0][0]),
                1
              );
              currentHand.tiles.splice(
                currentHand.tiles.indexOf(possibleChi[0][1]),
                1
              );
              currentHand.tiles.splice(
                currentHand.tiles.indexOf(possibleChi[0][2]),
                1
              );
              currentHand.tiles.unshift(-1, -1, -1);
              currentHand.melds[currentHand.currentMeld].push(
                ...possibleChi.pop()
              );
              currentHand.chiCount++;
              console.log(`Found a Chi!
              tile: ${tiles[tile].value} ${tiles[tile].suit}
              currentMeld: ${currentHand.currentMeld}
              currentMeld content: ${currentHand.melds[currentHand.currentMeld]}
              all melds: ${currentHand.melds}
              pairCount: ${currentHand.pairCount}
              ponCount: ${currentHand.ponCount}
              kanCount: ${currentHand.kanCount}
              chiCount: ${currentHand.chiCount}
              doraCount: ${currentHand.doraCount}
              incrementing current meld...`);
              currentHand.currentMeld++;
            } else {
              //if we don't know the pair, add both melds to possibleMelds and continue.
              possibleMelds.chi.push(...possibleChi);
              possibleMelds.pairs.push([tile, tile]);
            }
            break;
          } else {
            if (currentHand.pairCount === 1) {
              //if we already know the pair, and there's more than one possible chi, then the tile must belong to one of those chi. keep sorting the rest of the tiles.
              possibleMelds.chi.push([possibleChi]);
              break;
            } else {
              possibleMelds.chi.push(...possibleChi);
              possibleMelds.pairs.push([tile, tile]);
              break;
            }
          }

        case 3:
          this.checkChi(currentHand, tile, possibleChi);

          if (possibleChi.length === 0) {
            //if we have three of a given tile, and that tile does not fit into a chi, it must be a pon.
            //add the pon to the current meld and remove the tiles from the hand.
            currentHand.melds[currentHand.currentMeld].push(tile, tile, tile);
            utils.spliceAndUnshift(currentHand, tile, 3);
            currentHand.ponCount++;

            console.log(`Found a pon!
            tile: ${tiles[tile].value} ${tiles[tile].suit}
            currentMeld: ${currentHand.currentMeld}
            currentMeld content: ${currentHand.melds[currentHand.currentMeld]}
            all melds: ${currentHand.melds}
            pairCount: ${currentHand.pairCount}
            ponCount: ${currentHand.ponCount}
            kanCount: ${currentHand.kanCount}
            chiCount: ${currentHand.chiCount}
            doraCount: ${currentHand.doraCount}
            incrementing current meld...`);
            currentHand.currentMeld++;
            break;
          } else {
            possibleMelds.chi.push(...possibleChi);
            possibleMelds.pon.push([tile, tile, tile]);
            break;
          }

        case 4:
          this.checkChi(currentHand, tile, possibleChi);
          //if we have four of a given tile, and that tile wouldn't fit into any chi, it must be a kan.
          if (possibleChi.length === 0) {
            currentHand.melds[currentHand.currentMeld].push(
              tile,
              tile,
              tile,
              tile
            );
            utils.spliceAndUnshift(currentHand, tile, 4);
            currentHand.kanCount++;
            console.log(`Found a Kan!
            tile: ${tiles[tile].value} ${tiles[tile].suit}
            currentMeld: ${currentHand.currentMeld}
            currentMeld content: ${currentHand.melds[currentHand.currentMeld]}
            all melds: ${currentHand.melds}
            pairCount: ${currentHand.pairCount}
            ponCount: ${currentHand.ponCount}
            kanCount: ${currentHand.kanCount}
            chiCount: ${currentHand.chiCount}
            doraCount: ${currentHand.doraCount}
            incrementing current meld...`);

            currentHand.currentMeld++;
            break;
          } else {
            possibleMelds.chi.push(possibleChi);
            possibleMelds.kan.push([tile, tile, tile, tile]);
            break;
          }

        default:
          return false;
      }

      if (currentHand.tiles.filter((x) => x !== -1).length === 0) {
        return 0;
      }
      if (unsortedCount > currentHand.tiles.filter((x) => x !== -1).length) {
        //if reduceHand returns 1, we successfully reduced the hand, and should keep trying until there are no more tiles or we can't reduce any further.
        return this.reduceHand(currentHand, possibleMelds);
      }
      if (unsortedCount === currentHand.tiles.filter((x) => x !== -1).length) {
        return 2;
      }
    }
  },
};
