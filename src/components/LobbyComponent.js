    import React,{useEffect, useState} from 'react'
    import logo from '../logo.png'
    import { wsurl } from '../App';
    import useWebSocket from 'react-use-websocket';
    import {useNavigate} from 'react-router-dom';


    // function addToTable(data){
    //     document.getElementsByTagName('tbody').innerHTML= '';
    //     var tr = document.createElement('tr');
    //     var i=0
    //     for (const key in data) {
    //         tr.innerHTML='';
    //         var td1 = document.createElement('td');
    //         td1.innerHTML = i+1;
    //         tr.appendChild(td1);
    //         var td2 = document.createElement('td');
    //         td2.innerHTML = data[key]['username'];
    //         tr.appendChild(td2);
    //         var td3 = document.createElement('td');
    //         td3.innerHTML = data[key]['color'];
    //         tr.appendChild(td3);
    //         document.getElementsByTagName('tbody')[0].appendChild(tr);
    //         console.log(tr);
    //         tr = document.createElement('tr')
    //         i++;
    //     }
    // }

    function Lobby(){
        const { lastJsonMessage } = useWebSocket(wsurl, {
            onOpen: () => {
                console.log('Lobby: WebSocket connection established.');
            },
            share: true,
            filter: false
        });
        const [tableData, setTableData] = useState([]);
        const navigate = useNavigate();

        const changePlayerCount = (players) => {
            setPlayerCount(Object.keys(players).length);
        };

        useEffect(() => {
            if(lastJsonMessage){
                console.log("Client lobby: ",lastJsonMessage);
                if (lastJsonMessage.type==='playerevent') {
                    setTableData(lastJsonMessage.data.players);
                    changePlayerCount(lastJsonMessage.data.players);
                }
                else if (lastJsonMessage.type==='startsignal'){

                }
            }
        }, [lastJsonMessage]);
        return(
            <div className="LobbyTable">
                <img src={logo} className="App-logo-small" alt="logo" />
                <br />
                <div id='table-body'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th id='sno'>S.No. </th>
                                <th id='player'>Player</th>
                                <th id='color'>Color</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(tableData).map((key,index) => (
                                <tr key={key}>
                                    <td>{index+1}</td>
                                    <td>{tableData[key].username}</td>
                                    <td>{tableData[key].color}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    export default Lobby;