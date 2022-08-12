//yaku reference https://en.wikipedia.org/wiki/Japanese_mahjong_yaku
let tiles = require("../../resources/tiles.json");

//organize tiles into categories to check the hand against
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

//example hands/dora for testing
let testhand = [27, 27, 27, 0, 1, 2, 3, 34, 5, 6, 7, 8, 33, 33];
let testdora = [27, 3, 10];
let sevenPairsTestHand = [1, 1, 10, 10, 19, 19, 28, 28, 3, 3, 12, 12, 21, 21];
let ryanpeikoTestHand = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 30, 30];
let badhand = [0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 0, 8];

//additional scoring relevant variables (incorporate into currentHand object?)
let prevailingWind = 30;
let seatWind = 30;
let dealer = true;
let ron = true;
let openHand = false;
let winningTile = 33;
let riichi = false;

//count dora in hand
function countDora(currentHand, dora) {
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
}
//replace red fives with regular fives for simplicity in sorting the hand and increment dora count for each red five
function replaceFives(currentHand) {
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
}

function isOrphans(currentHand) {
  for (let tile of currentHand.tiles) {
    if (simples.includes(tile)) {
      return false;
    }
  }
  return new Set(hand).size === 13;
}

function isSevenPairs(currentHand) {
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
}

//check to see if a seven pairs hand could actually be a ryanpeiko.
function isRyanpeiko(currentHand) {
  let possibleChi = [];

  for (let tile of currentHand.tiles) {
    checkChi(currentHand, tile, possibleChi);
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
}
//find melds that can be made from honors in hand. if the hand is not thirteen orphans or seven pairs, then an honor tile must be used in either a pair, pon, or kan.
function checkHonors(currentHand, tile) {
  switch (currentHand.tiles.filter((x) => x === tile).length) {
    case 1:
      return false;
    case 2:
      currentHand.melds[4].push(tile, tile);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.unshift(-1, -1);
      currentHand.pairCount++;
      currentHand.currentMeld--;
      break;
    case 3:
      currentHand.melds[currentHand.currentMeld].push(tile, tile, tile);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.unshift(-1, -1, -1);
      currentHand.ponCount++;
      break;
    case 4:
      currentHand.melds[currentHand.currentMeld].push(tile, tile, tile, tile);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
      currentHand.tiles.unshift(-1, -1, -1, -1);
      currentHand.kanCount++;
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
}
//see what chi can be made from a given array of tiles and add those possibilites to the possibleChi array.
function checkChi(currentHand, tile, possibleChi) {
  if (
    !nines.includes(tile) &&
    !eights.includes(tile) &&
    currentHand.tiles.includes(tile + 1) &&
    currentHand.tiles.includes(tile + 2)
  ) {
    possibleChi.push([tile, tile + 1, tile + 2]);
  }
  if (
    !ones.includes(tile) &&
    !twos.includes(tile) &&
    currentHand.tiles.includes(tile - 1) &&
    currentHand.tiles.includes(tile - 2)
  ) {
    possibleChi.push([tile - 2, tile - 1, tile]);
  }
  if (
    !ones.includes(tile) &&
    !nines.includes(tile) &&
    currentHand.tiles.includes(tile - 1) &&
    currentHand.tiles.includes(tile + 1)
  ) {
    possibleChi.push([tile - 1, tile, tile + 1]);
  }
}
//if possibleMelds includes duplicates, remove them unless the hand contains more than one of all tiles in the meld.
//don't need to bother with that check for pon/kan bc a hand cannot contain duplicate pon/kan.
function removeDupes(possibleMelds, currentHand) {
  if (possibleMelds.chi.length > 0) {
    for (let meld of possibleMelds.chi) {
      if (meld.includes(-1)) {
        continue;
      }
      for (let i = 0, len = possibleMelds.chi.length; i < len; i++) {
        if (possibleMelds.chi[i] === meld) {
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
}

//we've taken care of all tiles that only work in one meld, and created arrays containing all the possible melds for the remaining tiles.
//now, we need to make sure that the remaining tiles can all be worked into valid melds.
//if we can't make the rest of the tiles work, then we can toss this possible meld and move on to the next one.
function reducePossibleMelds(possibleMelds, currentHand) {
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
}

function reduceHand(currentHand, possibleMelds) {
  let unsortedCount = currentHand.tiles.filter((x) => x !== -1).length;
  for (let tile of currentHand.tiles) {
    let possibleChi = [];

    if (tile === -1) {
      continue;
    }
    switch (currentHand.tiles.filter((x) => x === tile).length) {
      case 1:
        //we know this tile cannot be a pair/pon/kan, so it must be part of a chi.
        checkChi(currentHand, tile, possibleChi);
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

        if (possibleChi.length > 1) {
          //if a tile fits into more than one meld, don't do anything other than adding those melds to possibleMelds obj. for now, we just want to identify all tiles that only fit into one meld.
          possibleMelds.chi.push(...possibleChi);
          break;
        }

      case 2:
        checkChi(currentHand, tile, possibleChi);
        if (possibleChi.length === 0) {
          //if we have two of a given tile, and that tile does not fit into a chi, it must be a pair.
          if (currentHand.pairCount > 0) {
            //if we already have a pair, the hand is invalid.
            return false;
          }
          //if not, then add the tiles to the pair meld (index 4), remove the tiles from the hand, then increment the pair count.
          currentHand.melds[4].push(tile, tile);
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.unshift(-1, -1);
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
        }
        if (possibleChi.length > 1) {
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
        checkChi(currentHand, tile, possibleChi);

        if (possibleChi.length === 0) {
          //if we have three of a given tile, and that tile does not fit into a chi, it must be a pon.
          //add the pon to the current meld and remove the tiles from the hand.
          currentHand.melds[currentHand.currentMeld].push(tile, tile, tile);
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.unshift(-1, -1, -1);
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
        }
        if (possibleChi.length > 0) {
          possibleMelds.chi.push(...possibleChi);
          possibleMelds.pon.push([tile, tile, tile]);
          break;
        }
      case 4:
        checkChi(currentHand, tile, possibleChi);
        //if we have four of a given tile, and that tile wouldn't fit into any chi, it must be a kan.
        if (possibleChi.length === 0) {
          currentHand.melds[currentHand.currentMeld].push(
            tile,
            tile,
            tile,
            tile
          );
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.splice(currentHand.tiles.indexOf(tile), 1);
          currentHand.tiles.unshift(-1, -1, -1, -1);
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
        }
        if (possibleChi.length > 0) {
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
      return 1;
    }
    if (unsortedCount === currentHand.tiles.filter((x) => x !== -1).length) {
      return 2;
    }
  }
}

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
  replaceFives(currentHand);
  countDora(currentHand, dora);
  //sort tiles by index from low to high
  currentHand.tiles.sort((a, b) => a - b);
  //sort tiles by value from low to high

  //quick checks for unusual hands
  if (isOrphans(currentHand) && !openHand) {
    return "Thirteen Orphans";
  }
  if (isSevenPairs(currentHand) && !openHand) {
    if (isRyanpeiko(currentHand)) {
      return "Ryanpeiko";
    }
    return "Seven Pairs";
  }

  //go through all the tiles in hand and deal with just the honors.
  for (let tile of currentHand.tiles) {
    if (honors.includes(tile)) {
      //honors can't be in a chi, so we only need to look for pairs/pon/kan which are all mutually exclusive.
      //if we find any of those, we can lock them in right away.
      checkHonors(currentHand, tile);
    } else {
      continue;
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
  let result = reduceHand(currentHand, possibleMelds);
  removeDupes(possibleMelds, currentHand);

  while (result === 1) {
    //if reduceHand returns 1, we successfully reduced the hand, and should keep trying until there are no more tiles or we can't reduce any further.
    result = reduceHand(currentHand, possibleMelds);
    removeDupes(possibleMelds, currentHand);
  }
  if (result === 0) {
    //if reduceHand returns 0, the hand should be good to go.
    console.log(`We got ourselves a hand baby:
    meld one:
    ${tiles[currentHand.melds[0][0]].value + " " + tiles[currentHand.melds[0][0]].suit}, ${tiles[currentHand.melds[0][1]].value + " " + tiles[currentHand.melds[0][1]].suit}, ${tiles[currentHand.melds[0][2]].value + " " + tiles[currentHand.melds[0][2]].suit} 
    meld two:
    ${tiles[currentHand.melds[1][0]].value + " " + tiles[currentHand.melds[1][0]].suit}, ${tiles[currentHand.melds[1][1]].value + " " + tiles[currentHand.melds[1][1]].suit}, ${tiles[currentHand.melds[1][2]].value + " " + tiles[currentHand.melds[1][2]].suit}
    meld three:
    ${tiles[currentHand.melds[2][0]].value + " " + tiles[currentHand.melds[2][0]].suit}, ${tiles[currentHand.melds[2][1]].value + " " + tiles[currentHand.melds[2][1]].suit}, ${tiles[currentHand.melds[2][2]].value + " " + tiles[currentHand.melds[2][2]].suit}
    meld four:
    ${tiles[currentHand.melds[3][0]].value + " " + tiles[currentHand.melds[3][0]].suit}, ${tiles[currentHand.melds[3][1]].value + " " + tiles[currentHand.melds[3][1]].suit}, ${tiles[currentHand.melds[3][2]].value + " " + tiles[currentHand.melds[3][2]].suit}
    and the pair:
    ${tiles[currentHand.melds[4][0]].value + " " + tiles[currentHand.melds[4][0]].suit}, ${tiles[currentHand.melds[4][1]].value + " " + tiles[currentHand.melds[4][1]].suit}
    `);
    return currentHand;
  }
  if (result === 2) {
    //if reduceHand returns 2, we couldn't reduce the hand any further, and we now need to call reducePossibleMelds to try to narrow down the possibliities.
    //we can try to simplify things a little more before we do though.
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