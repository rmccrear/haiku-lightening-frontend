import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';
import JoinGame from "./components/JoinGame"
import HaikuGame from './components/HaikuGame';
import gameRunner from './lib/GameRunner';
import randomGameId from './lib/random-slug';
const SERVER = process.env.REACT_APP_WS_URL;

function whoseTurn(turn, players){
  const currentTurnIdx = turn%players.length;
  const currentPlayer = players[currentTurnIdx]
  console.log(`turn: ${turn}; ${currentPlayer}`)
  return currentPlayer
}

function App() {
  const [username, setUsername] = useState('')
  const [gameId, setGameId] = useState('')
  const [hasJoinedGame, setHasJoinedGame] = useState(false)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [gameData, setGameData] = useState({})
  const [joinFailed, setJoinFailed] = useState(false)
  const [wordNotAccepted, setWordNotAccepted] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [currentPlayer, setCurrentPlayer] = useState();
  gameRunner.onConnect(()=>{
    setIsConnected(true)
  })
  gameRunner.onDisconnect(()=>{
    setIsConnected(false)
  })
  gameRunner.onJoinGame(()=>{
    console.log("onJoinGame")
    setHasJoinedGame(true)
  })
  gameRunner.onJoinFailed((payload)=>{
    console.log("onJoinFailed")
    setJoinFailed(payload);
  })
  gameRunner.onGameStart((payload)=>{
    console.log("onGameStart", payload)
    setIsGameStarted(true)
    setGameData(payload)
    const currentPlayer = whoseTurn(payload.turn, payload.friends)
    setCurrentPlayer(currentPlayer)
  })
  gameRunner.onNextTurn((payload)=>{
    console.log("onNextTurn")
    setWordNotAccepted('')
    setGameData(payload)
    const currentPlayer = whoseTurn(payload.turn, payload.friends)
    setCurrentPlayer(currentPlayer)
  })
  gameRunner.onWordNotAccepted((payload)=>{
    console.log("onWordNotAccepted")
    setWordNotAccepted(payload.word)
  })
  const startGame = ({username, gameId}) => {
    gameId = gameId || randomGameId();
    setUsername(username)
    setGameId(gameId)
    gameRunner.setGameId(gameId)
    gameRunner.setUsername(username)
    gameRunner.joinGame(gameId)
  }
  const submitNextWord = (word) => {
    console.log("submiting next word")
    gameRunner.player.takeTurn(word)
  }

  return (
    <div className="App">
      {
      !isConnected ? <Alert variant="danger">Not connected to server {SERVER} </Alert>
      :              <Alert variant="success">Connected to server {SERVER} </Alert>
      }
      <div>
        <h1> Haiku Lightening </h1>
        <h2> Hello {username} </h2>
        <div className="join-game-container">
          { !hasJoinedGame ? <JoinGame {...{startGame, joinFailed} }/> : ''}
        </div>
      </div>
      <div className="game-joined-container">
        {hasJoinedGame  ? <span>Game <strong>{gameId}</strong> Joined!</span> : ''}
      </div>
      <div className="game-container">
        { isGameStarted ? <HaikuGame {...{...gameData.haiku, submitNextWord, wordNotAccepted, username, currentPlayer, players: gameData.friends}} /> 
        : hasJoinedGame ? 'Waiting on other players.' : '' }
      </div>
    </div>
  )
}

export default App
