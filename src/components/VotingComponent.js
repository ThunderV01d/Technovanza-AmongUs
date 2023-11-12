import { useState,useEffect } from "react";
import { wsurl } from "../App";
import useWebSocket from "react-use-websocket";
import {useNavigate} from 'react-router-dom';

function Voting({afterEnd}){
    const {sendJsonMessage,lastJsonMessage} = useWebSocket(wsurl,{
        share:true,
        filter:false,
    });
    const navigate = useNavigate();

    //define states
    const [votes,setVotes] = useState({});
    const [voteSubmitted, setVoteSubmitted] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [previouslySelectedPlayer, setPreviouslySelectedPlayer] = useState(null);
    const [resultOfVote, setResultOfVote] = useState("");
    const [myUsername,setMyUsername] = useState("");
    //requests
    useEffect(() => {
        sendJsonMessage({
            type: 'votePlayer'
        })
        sendJsonMessage({
            type: 'requestUsername'
        })
      },[sendJsonMessage]);    
    //message handling
    useEffect(() => {
        if(lastJsonMessage){
            if(lastJsonMessage.type === 'votePlayer'){
                if(lastJsonMessage.data==='ejected'){
                    setResultOfVote("1 player being ejected...");
                }
                else if(lastJsonMessage.data==='tie'){
                    setResultOfVote("No players ejected...")
                }
                else if(lastJsonMessage.data==='completed'){
                    navigate('/game');
                }
                else{
                    setVotes(lastJsonMessage.data);
                }
            }
            else if(lastJsonMessage.type === 'requestUsername'){
                setMyUsername(lastJsonMessage.data);
            }
            else if(lastJsonMessage.type === 'killPlayer'){
                //TODO: ENSURE THAT ON THE GAME SCREEN, PLAYER DEAD IS SET TO TRUE
                console.log("Recieved kill on wrong screen");
            }
            else if(lastJsonMessage.type === 'gameEnded'){
                afterEnd && afterEnd(lastJsonMessage.data);
                navigate('/game-ended');
            }
        }
      }, [lastJsonMessage]);
    //functions
    const handleVoteChange = (player) => {
        if (previouslySelectedPlayer) {
            setVotes((prevVotes) => ({
              ...prevVotes,
              [previouslySelectedPlayer]: {
                ...prevVotes[previouslySelectedPlayer],
                votes: prevVotes[previouslySelectedPlayer].votes - 1,
              },
            }));
        }
        setSelectedPlayer(player);
        setVotes(prevVotes => ({
          ...prevVotes,
          [player]: {
            ...prevVotes[player],
            votes: prevVotes[player].votes + 1,
          },
        }));
        setPreviouslySelectedPlayer(player);
    };
    const submitVotes = () => {
        //Send message to server to update votes
        if (myUsername) {
            setVotes((prevVotes) => {
                const updatedVotes = { ...prevVotes };
                updatedVotes[myUsername] = {
                    ...updatedVotes[myUsername],
                    voted: true,
                };
                console.log(updatedVotes); // Log the updatedVotes here
                sendJsonMessage({
                    type:'votePlayer',
                    data: updatedVotes
                })
                return updatedVotes;
            });
        }
        setVoteSubmitted(true);
    }; 
    //markup
    return(
        <div className="Voting">
            <h2>EMERGENCY MEETING</h2>
            <form>
                <fieldset>
                    <legend>VOTE</legend>
                    {/* Dynamically create radio buttons based on the votes state */}
                    {Object.entries(votes).map(([player, data]) => (
                    <div key={player}>
                        <input
                        type="radio"
                        name="vote"
                        value={player}
                        onChange={() => handleVoteChange(player)}
                        disabled={voteSubmitted}
                        />
                        <label>{`${player} (${data.votes})`}</label>
                    </div>
                    ))}
                    {/* Submit button */}
                    <button type="button" onClick={submitVotes} disabled={voteSubmitted}>
                    VOTE
                    </button>
                </fieldset>
                <p>{resultOfVote}</p>
            </form>
        </div>
    )
}
export default Voting;