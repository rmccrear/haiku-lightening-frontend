import io from 'socket.io-client'
import Player from './Player';
const { v4: uuid } = require("uuid");
const SERVER = process.env.REACT_APP_WS_URL

class GameRunner{
    constructor(){
        this.io = io(SERVER) // server
        this.player = new Player(this.io)

        // setup listeners
        /*
        this.player.onJoinGame();
        this.player.onGameStart()
        this.player.onTurn()
        this.player.onTakeTurn()
        */
    }

    setGameId(gameId){
        this.gameId = gameId
    }

    setUsername(username) {
        this.username = username
    }

    joinGame(gameName){
        this.gameId = gameName || uuid();
        if(this.username) {
            this.player.setUsernameAndJoin(this.gameId, this.username);
        } else {
            console.error("username not supplied")
        }
    }

    onConnect(fn){
        this.player.io.on("connect", fn);
    }
    onDisconnect(fn){
        this.player.io.on("disconnect", fn);
    }

    onJoinFailed(fn) {
        this.player.onJoinFailed(fn)
    }

    onJoinGame(fn) {
        this.player.onJoinGame(fn)
    }

    onGameStart(fn) {
        this.player.onGameStart(fn)
    }

    onNextTurn(fn) {
        this.player.onNextTurn(fn)
    }
    
    onWordNotAccepted(fn) {
        this.player.onWordNotAccepted(fn)
    }
}

const gameRunner = new GameRunner();

export default gameRunner;