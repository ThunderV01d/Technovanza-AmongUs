import React, { useEffect } from "react";
import { useState } from "react";
import useWebSocket from "react-use-websocket";
import { wsurl } from "../App";
import { useNavigate } from "react-router";

function Tasklist(){
    //define states
    const [tasks, setTasks] = useState([
        {id:1, title: 'Task 1', description: 'This is the description for Task 1.',checked: false},
        {id:2, title: 'Task 2', description: 'This is the description for Task 2.',checked: false},
      ]);
    //websocket connection
    const {sendJsonMessage,lastJsonMessage} = useWebSocket(wsurl,{
        share:true,
        filter:false,
    });
    const handleCheckboxChange = (taskId) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, checked: !task.checked } : task
          
        ));
      };
    const toggleDescription = (index) => {
        const updatedTasks = tasks.map((task, i) => {
          if (i === index) {
            return { ...task, expanded: !task.expanded };
          }
          return task;
        });
        setTasks(updatedTasks);
    };
    return(
        <div className="task-box">
            <p id="task-header">Tasks:</p>
            <ul className="task-list">
                {tasks.map((task,index) => (
                    <li key={task.id} className={`task ${task.expanded ? 'expanded' : ''} ${task.checked ? 'disabled' : ''}`}
                    style={{
                        color: task.checked ? '#666666' : 'rgb(0,0,0)',
                        pointerEvents: task.checked ? 'none' : 'auto',
                        
                      }}>
                    <span className="task-title">
                        <div className="arrow-bullet" onClick={() => toggleDescription(index)}>
                        {task.expanded ? '▼' : '▶'} {/* You can use your own arrow icons here */}
                        </div>
                        {task.title}
                        <div className='checkbox-container'>
                            <input type="checkbox" id={`checkbox-${index}`} checked={task.checked} onChange={() => handleCheckboxChange(task.id)} disabled={task.checked}/>
                            <label htmlFor={`checkbox-${index}`}></label>
                        </div>
                    </span>
                    <div className="description" style={{ display: task.expanded ? 'block' : 'none' }}>
                        <p>{task.description}</p>
                    </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}


function Game(){
    function secondsToMMSS(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
      
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
      
        return `${formattedMinutes}:${formattedSeconds}`;
    }
    const navigate = useNavigate();
    //define states
    const [timer,setTimer] = useState(5);
    //websocket connections
    const {sendJsonMessage,lastJsonMessage} = useWebSocket(wsurl,{
        share:true,
        filter:false,
    });
    //request sending
    useEffect(() => {
        sendJsonMessage({
            type: 'requestTime',
            data: 'game'
        });
    },[sendJsonMessage]);
    //message handling
    useEffect(() => {
        if(lastJsonMessage){
            if (lastJsonMessage.type === 'requestTime') {
                setTimer(secondsToMMSS(lastJsonMessage.data));
                if(lastJsonMessage.data===0){
                    // navigate('/cum');
                }
            }
        }
    }, [lastJsonMessage,timer,navigate]);
    //periodic request for time
    useEffect(() => {
        const timerInterval = setInterval(() => {
          sendJsonMessage({
            type: "requestTime",
            data: "game",
          });
        }, 1000);
        // Clear the interval when the component unmounts
        return () => clearInterval(timerInterval);
      }, [sendJsonMessage]);
    //html
    return(
        <div className='Game'>
            <p className="game-timer">{timer}</p>
            <Tasklist />
        </div>
    )
}

export default Game;