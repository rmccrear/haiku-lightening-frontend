
import { Fragment, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';

const haikuLineForm = [5,7,5]

function HaikuLine({line, idx}) {
    console.log(line)
    return (
        <p>
            {idx+1}. {line.join(" ")}
        </p>
    );
}

//function HaikuGame({lines, linePosition, finished, nextWord}) {
function HaikuGame(props) {
    const [newNextWord, setNewNextWord] = useState('')
    console.log(props)
    const {lines, submitNextWord, finished, wordNotAccepted} = props;
    const onNextWordChange = (event) => {
        setNewNextWord(event.target.value)
    }
    const submit = () => {
        submitNextWord(newNextWord)
        setNewNextWord('')
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            submit();
        }
    }
    return (
        <div>
            <div>
                {
                  lines.map((line, i) => <HaikuLine  key={i} line={line} idx={i}/> )
                }
            </div>
                {
                    !finished ? 
                        <>
                            <Form.Label> Add next word:</Form.Label>
                            <Form.Control onKeyDown={handleKeyDown} value={newNextWord} onChange={onNextWordChange} type="text" />
                            {
                                wordNotAccepted ? 
                                  <div style={{color: "red"}}>Word not accepted "{wordNotAccepted}"</div>
                                : ''
                            }
                            <Button variant='primary' onClick={submit}>Submit</Button>
                        </>
                    :
                        <div>
                            "The Haiku is finished!" 
                        </div>
                }
        </div>
    )
}

export default HaikuGame;