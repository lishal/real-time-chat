import React, { useEffect, useState, useRef } from 'react'
import "./Chat.css"
import io from 'socket.io-client';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import lianLogo from "../../assets/lian.png"
import Loading from '../loading/Loading';
import copySvg from "../../assets/svg/copySvg.svg"
import crownSvg from "../../assets/svg/crown.svg"
function Chat() {
    const location = useLocation();
    const param = useParams();
    const navigate = useNavigate();
    const { state } = location;
    const [loading, setLoading] = useState(false);
    const [roomdata, setRoomdata] = useState("");
    const [peoplelist, setPeoplelist] = useState("");
    const textRef = useRef(null);
    const socket = io.connect(`${import.meta.env.LIAN_SERVER_URL}`);
    useEffect(() => {
        if (state != null) {
            const paramUrl = atob(param.token)
            if (paramUrl !== state.roomId) {
                navigate('/page-not-found');
            }
        }
        else {
            navigate('/page-not-found');
        }

    }, [location, navigate]);
    // useEffect(() => {
    //     setLoading(true)
    //     socket.emit("newUser", state);
    //     setLoading(false)
    //     socket.on("youJoined", (data) => {
    //         setPeoplelist(data.peopleList)
    //     })
    //     socket.on("userJoin", (data) => {
    //         setPeoplelist(data.peopleList)
    //     })
    //     socket.on("leftUser", data => {
    //         setPeoplelist(data)
    //     })

    // }, [])
    // useEffect(() => {
    //     if (roomdata != "" && peoplelist != "") {
    //         setLoading(false)
    //     }
    //     else {
    //         setLoading(true)
    //     }
    // }, [peoplelist])

    const copyRoomCode = () => {
        textRef.current.select();
        document.execCommand('copy');
        const tooltip = document.getElementById("tooltip-chat");
        tooltip.innerHTML = "Copied!";
        setTimeout(() => {
            tooltip.innerHTML = "Copy text!";
        }, 1000);
    };

    return (
        <div className='chatContainer'>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className="leftsideUserPanel">
                        <div className="leftsideHeader flex-center">
                            <img src={lianLogo} alt="BusinessLogo" className='leftsideHeader-image' />
                            <span className='leftsideHeader-name'>LIAN chat</span>
                        </div>
                        <div className="leftSideContainer">
                            <div className="roomInfo">
                                <span> RoomId: </span>
                                <input ref={textRef} className='roomInfoTextBox' value="1234-1234-1234-1234" readOnly />
                                <img src={copySvg} alt="copyText" className='copySvg-chat' onClick={copyRoomCode} />
                                <span className="tooltip-chat flex-center" id="tooltip-chat">Copy text!</span>
                            </div>
                            <div className="roomInfo">
                                <span>Room Name: </span>
                                <input className='roomInfoTextBox' value="Demo Room 1" readOnly />
                            </div>
                            <div className="roomInfo only_md-device">
                                <span>2 Active Participation</span>
                            </div>
                            <div className="linebreak">
                                <div className="chat-participation flex-column">
                                    <div className="participation-header ">
                                        Room Participation
                                    </div>
                                    <div className="participation-area flex-column">
                                        <div className="participation-user flex-row">
                                            <div className="online_indicator">
                                            </div>
                                            <div className="participation-username">
                                                Lishal Bhari
                                            </div>
                                            <div className="participation-role  flex-row">
                                                (You)
                                                <img src={crownSvg} alt="owner" className='crownsvg' />
                                            </div>
                                        </div>
                                        <div className="participation-user flex-row">
                                            <div className="online_indicator">
                                            </div>
                                            <div className="participation-username">
                                                Annu Ramjali
                                            </div>
                                            <div className="participation-role">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rightSideChatPanel flex-row">
                        <div className="rightSidePanelContainer">

                        </div>

                        <ul>
                            {/* {Array.isArray(roomdata) && roomdata.map((room) => (
                                <div key={room._id}>{room.userName}</div>
                            ))} */}
                        </ul>

                    </div>
                </>
            )}


        </div>
    )
}

export default Chat