import React, { useEffect, useState, useRef } from 'react'
import "./Chat.css"
import io from 'socket.io-client';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import lianLogo from "../../assets/lian.png"
import Loading from '../loading/Loading';
import copySvg from "../../assets/svg/copySvg.svg"
import crownSvg from "../../assets/svg/crown.svg"
import ting from "../../assets/ting.mp4"

function MessageList({ messages }) {
    const messageAreaRef = useRef(null);
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messageAreaRef.current) {
            messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
        }
    };
    return (
        <div ref={messageAreaRef} className="message-area">
            {messages.map((msg, index) => (
                <div key={index} className={`message-group ${msg.position}`}>
                    {msg.position !== "center" && (
                        <>
                            <div className="message-user">{msg.username}</div>
                            <div className="message">{msg.message}</div>
                            <div className="message-time">{msg.time}</div>
                        </>
                    )}
                    {msg.position === "center" && (
                        <div className="message">{msg.message}</div>
                    )}
                </div>
            ))}
        </div>
    );
}
function Chat() {
    const location = useLocation();
    const param = useParams();
    const navigate = useNavigate();
    const { state } = location;
    const [loading, setLoading] = useState(false);
    const [roomdata, setRoomdata] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [peoplelist, setPeoplelist] = useState("");
    const textRef = useRef(null);
    const audio = new Audio(ting);
    const socket = io.connect(`https://lian-bfit.onrender.com`);
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
    useEffect(() => {
        setLoading(true)
        socket.emit("newUser", state);
        setLoading(false)
        socket.on("youJoined", (data) => {
            if (data.roomInfo.roomId === state.roomId) {
                setPeoplelist(data.peopleList)
                setRoomdata(data.roomInfo)
            }
        })
        socket.on("userJoin", (data) => {
            if (data.roomInfo.roomId === state.roomId) {
                setPeoplelist(data.peopleList)
                appendMessage(`${data.user} joined the chat! `, "center")
            }
        })
        socket.on("receiveMessage", (data) => {
            if (data.roomId === state.roomId && data.userId != state.userId) {
                appendMessage(data.message, "left", data.userName);
            }

        });
        socket.on("leftUser", data => {
            if (data.roomId === state.roomId) {
                setPeoplelist(data.peopleList)
                appendMessage(`${data.user} left the chat! `, "center")
            }
        })

    }, [])
    useEffect(() => {
        if (roomdata != "" && peoplelist != "") {
            setLoading(false)
        }
        else {
            setLoading(true)
        }
    }, [peoplelist])

    const copyRoomCode = () => {
        textRef.current.select();
        document.execCommand('copy');
        const tooltip = document.getElementById("tooltip-chat");
        tooltip.innerHTML = "Copied!";
        setTimeout(() => {
            tooltip.innerHTML = "Copy text!";
        }, 1000);
    };

    const currentTime = () => {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };
    const handleSubmit = () => {
        if (message != "") {
            socket.emit("sendMessage", { message: message, stateInfo: state });
            appendMessage(message, "right");
            setMessage("");
        }
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit();
        }
    };
    const appendMessage = (message, position, username = state.name) => {
        const newMessage = {
            message,
            position,
            username,
            time: currentTime()
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        if (position == "left" || position == "center") {
            audio.play();
        }
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
                                <input ref={textRef} className='roomInfoTextBox' value={roomdata.roomId} readOnly />
                                <img src={copySvg} alt="copyText" className='copySvg-chat' onClick={copyRoomCode} />
                                <span className="tooltip-chat flex-center" id="tooltip-chat">Copy text!</span>
                            </div>
                            <div className="roomInfo">
                                <span>Room Name: </span>
                                <input className='roomInfoTextBox' value={roomdata.roomName} readOnly />
                            </div>
                            <div className="roomInfo only_md-device">
                                {Array.isArray(peoplelist) && <span>{peoplelist.length} Active Participation</span>}

                            </div>
                            <div className="linebreak">
                                <div className="chat-participation flex-column">
                                    <div className="participation-header ">
                                        Room Participation
                                    </div>
                                    <div className="participation-area flex-column">
                                        {Array.isArray(peoplelist) && peoplelist.map((people) => (
                                            <div className="participation-user flex-row" key={people._id}>
                                                <div className="online_indicator">
                                                </div>
                                                <div className="participation-username">
                                                    {people.userName}
                                                </div>
                                                {state.userId === people._id && <div className="participation-role  flex-row">
                                                    (You)
                                                </div>}
                                                {roomdata.userId === people._id && <div className="participation-role  flex-row">
                                                    <img src={crownSvg} alt="owner" className='crownsvg' />
                                                </div>}
                                            </div>
                                        ))}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rightSideChatPanel flex-column">
                        <MessageList messages={messages} />
                        <div className="message-box">
                            <input type="text" className="messageArea-input" value={message} onChange={handleMessageChange} onKeyDown={handleKeyPress} />
                            <button onClick={handleSubmit} className="sendBtn">Send</button>
                        </div>
                    </div>
                </>
            )}


        </div>
    )
}

export default Chat