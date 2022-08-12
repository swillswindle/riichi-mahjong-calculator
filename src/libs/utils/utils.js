module.exports = {
  spliceAndUnshift(currentHand, currentTile, numberOfTiles) {
    for (let i = 0; i < numberOfTiles; i++) {
      currentHand.tiles.splice(currentHand.tiles.indexOf(currentTile), 1);
      currentHand.tiles.unshift(-1);
    }
  },
};
