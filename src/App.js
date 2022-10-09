import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import JoinGame from "./components/JoinGame"
import HaikuGame from './components/HaikuGame';

import gameRunner from './lib/GameRunner';


function App() {
  const [username, setUsername] = useState('')
  const [gameId, setGameId] = useState('')
  const [hasJoinedGame, setHasJoinedGame] = useState(false)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [gameData, setGameData] = useState({})
  const [joinFailed, setJoinFailed] = useState(false)
  const [wordNotAccepted, setWordNotAccepted] = useState(false)
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
      <div>
        <h1> Haiku Lightening </h1>
        <h2> Hello {username} </h2>
        <div className="join-game-container">
          { !hasJoinedGame ? <JoinGame {...{startGame, joinFailed} }/> : ''}
        </div>
      </div>
      <div className="game-joined-container">
        {hasJoinedGame  ? "Game Joined!" : ''}
      </div>
      <div className="game-container">
        { isGameStarted ? <HaikuGame {...{...gameData.haiku, submitNextWord, wordNotAccepted}} /> 
        : hasJoinedGame ? 'Waiting on other players.' : '' }
      </div>
    </div>
  )
}

export default App
