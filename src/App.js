import { useState, useEffect } from 'react'
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
  const [playerList, setPlayerList] = useState([])
  const [maxPlayers, setMaxPlayers] = useState(3);
  const [isGameStarted, setIsGameStarted] = useState(false)
  const [gameData, setGameData] = useState({})
  const [currentPlayer, setCurrentPlayer] = useState();
  const [joinFailed, setJoinFailed] = useState(false)
  const [wordNotAccepted, setWordNotAccepted] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  useEffect(()=>{
    gameRunner.onConnect(()=>{
      setIsConnected(true)
    })
    gameRunner.onDisconnect(()=>{
      setIsConnected(false)
    })
    gameRunner.onJoinGame((payload)=>{
      console.log("onJoinGame")
      setHasJoinedGame(true)
      setPlayerList(payload.friends)
      setMaxPlayers(payload.maxPlayers);
    })
    gameRunner.onJoinFailed((payload)=>{
      console.log("onJoinFailed")
      setJoinFailed(payload);
    })
    gameRunner.onPartnerJoin((payload)=>{
      console.log("onPartnerJoin")
      setPlayerList(payload.friends)
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
      setWordNotAccepted(payload) // {word: __, message: __}
    })
  }, []);
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
        {hasJoinedGame  ? `Game ${gameId} Joined with ${playerList.join(", and  ")}! ${ playerList.length<maxPlayers ? "Waiting for more players to join." : ''}` : ''}
      </div>
      <div className="game-container">
        { isGameStarted ? <HaikuGame {...{...gameData.haiku, submitNextWord, wordNotAccepted, username, currentPlayer, players: gameData.friends}} /> 
        : hasJoinedGame ? 'Waiting on other players.' : '' }
      </div>
    </div>
  )
}

export default App
