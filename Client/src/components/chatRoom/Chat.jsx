import React, { useEffect } from 'react'
import "./Chat.css"
import io from 'socket.io-client';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
function Chat() {
    const location = useLocation();
    const param = useParams();
    const navigate = useNavigate();
    const { state } = location;

    const socket = io.connect('http://localhost:4001');


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

        socket.emit("newUser", state);
    }, [location, navigate]);

    return (
        <div className='chatContainer'>
            I am in

        </div>
    )
}

export default Chat