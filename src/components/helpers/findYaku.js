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