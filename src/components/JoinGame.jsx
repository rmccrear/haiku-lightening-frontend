import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';

function JoinGame(props) {
    const [username, setUsername] = useState('');
    const [gameId, setGameId] = useState('');
    const onChangeUsername = (event) => {
        setUsername(event.target.value);
    }
    const onChangeGameId = (event) => {
        setGameId(event.target.value);
    }
    const startGame = () => {
        console.log(username)
        props.startGame({username, gameId})
    }

    return (
        <div className="container">
            <Form>
            <Form.Group className="formGroup">
                <Form.Label>
                    What is your name? 
                </Form.Label>
                <Form.Control type="text" onChange={onChangeUsername} value={username} style={{ width: '30%' }}/>
                <Form.Label>
                    Which room would you like to join? 
                </Form.Label>
                <Form.Control onChange={onChangeGameId} value={gameId} type="text" style={{ width: '30%' }}/>
                { props.joinFailed ? 
                    <div style={{color: "red"}}>
                      Failed to join game "{props.joinFailed.gameId}". The reason is: {props.joinFailed.message}
                    </div>
                  : <Form.Text className="text-muted" style={{color: "red"}}>
                      Join a game by typing it's join code or name here that was shared with you. Leave blank to generate a new code.
                    </Form.Text>
                }
                <Button className="button" variant="primary" onClick={startGame}>
                    Let's Go!
                </Button>
            </Form.Group>
            </Form>
        </div>
    );
}

export default JoinGame;