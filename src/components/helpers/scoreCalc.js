// export function evaluateHand(hand) {
//   // determine if hand is a valid hand fitting the basic structure or one of the special hands
// }

let simples = [
  1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 16, 19, 21, 22, 23, 24, 25,
];
let honors = [27, 28, 29, 30, 31, 32, 33];
let man = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let pin = [9, 10, 11, 12, 13, 14, 15, 16, 17];
let sou = [18, 19, 20, 21, 22, 23, 24, 25, 26];
let terminals = [0, 8, 9, 17, 18, 26];

function isHand(hand) {
  let melds = [[], [], [], [], []];
    for (let tile of hand) {
        
    }}

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
