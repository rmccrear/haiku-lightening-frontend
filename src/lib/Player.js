class Player {

  constructor(io) {
    this.io = io;
  }

  setUsernameAndJoin(gameId, username) {
    const payload = {
      gameId,
      username,
    };
    this.io.emit("join", payload);
  }

  onJoinGame(fn) {
    const player = this;
    this.io.on("welcome", (data) => {
      console.log("welocome")
      fn(data, player);
    });
  }

  onJoinFailed(fn) {
    const player = this;
    this.io.on("join-failed", (data) => {
      console.log("join-failed", data)
      fn(data, player);
    });
  }

  onGameStart(fn) {
    const player = this;
    this.io.on("game", (data) => {
      console.log("game", data)
      fn(data, player);
    });
  }


  onNextTurn(fn) {
    const player = this;
    this.io.on("next-turn", (data) => {
      console.log("next-turn")
      fn(data, player);
    });
  }

  takeTurn(word) {
    console.log("EMIT: turn", word, this.username)
    this.io.emit("turn", { word, username: this.username });
  }

  onWordNotAccepted(fn) {
    const player = this;
    this.io.on("word-not-accepted", (data) => {
      console.log("word-not-accepted", data)
      fn(data, player);
    })
  }


}

export default Player
