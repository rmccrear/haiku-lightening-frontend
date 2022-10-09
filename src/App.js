import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';
import JoinGame from "./components/JoinGame"
import HaikuGame from './components/HaikuGame';

import gameRunner from './lib/GameRunner';
const SERVER = process.env.REACT_APP_WS_URL;

function App() {
  const [username, setUsername] = useState('')
  const [gameId, setGameId] = useState('')
  const [hasJoinedGame, setHasJoinedGame] = useState(false)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [gameData, setGameData] = useState({})
  const [joinFailed, setJoinFailed] = useState(false)
  const [wordNotAccepted, setWordNotAccepted] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
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
  })
  gameRunner.onNextTurn((payload)=>{
    console.log("onNextTurn")
    setWordNotAccepted('')
    setGameData(payload)
  })
  gameRunner.onWordNotAccepted((payload)=>{
    console.log("onWordNotAccepted")
    setWordNotAccepted(payload.word)
  })
  const startGame = ({username, gameId}) => {
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
        {hasJoinedGame  ? `Game ${gameId} Joined!` : ''}
      </div>
      <div className="game-container">
        { isGameStarted ? <HaikuGame {...{...gameData.haiku, submitNextWord, wordNotAccepted}} /> 
        : hasJoinedGame ? 'Waiting on other players.' : '' }
      </div>
    </div>
  )
}

export default App
