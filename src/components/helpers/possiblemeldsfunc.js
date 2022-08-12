for (let meld of possibleMelds) {
    let remainingTiles = JSON.parse(JSON.stringify(currentHand.tiles));
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