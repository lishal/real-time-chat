import React, { useState } from 'react'
import LogoAndSlogan from '../logoAndslogan/LogoAndSlogan'
import "./JoinRoom.css";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../loading/Loading';

function JoinRoom() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [roomCode, setRoomCode] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleRoomCodeChange = (event) => {
        setRoomCode(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
        if (name === "" || roomCode === "") {
            toast.error("Please fill the form!", {
                theme: "dark",
            })
        }
        else {
            setLoading(true);
            const data = {
                "name": name,
                "roomId": roomCode
            }
            fetch(`${import.meta.env.LIAN_SERVER_URL}/api/joinRoom`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {

                    if (response.status === 400) {
                        throw new Error("Invalid Room Code")
                    }
                    else if (response.status === 404) {
                        throw new Error('Invalid Api URL');
                    }

                    return response.json();
                })
                .then(data => {
                    setLoading(false);
                    const token = btoa(data.roomId);
                    navigate(`/chat/${token}`, { state: data })

                })
                .catch(error => {
                    setLoading(false);
                    if (error.message.includes("Invalid Room Code")) {
                        toast.error("Invalid Room Code", {
                            theme: "dark",
                            pauseOnHover: false,
                        })
                    }
                    else {
                        toast.error("Internal server error!", {
                            theme: "dark",
                            pauseOnHover: false,
                        })
                    }
                });

        }

    };

    return (
        <div className='joinRoom-container flex-column'>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                newestOnTop={true}

            />
            {loading ? <Loading /> : ''}
            <LogoAndSlogan />
            <div className="joinForm">
                <form action="#" className=" flex-center flex-column inputForm">
                    <div className="flex-row fieldContainer">
                        <span className='fieldDesc'>Enter your name:</span>
                        <input type="text" className='fieldInp' value={name}
                            onChange={handleNameChange} autoComplete='off' />
                    </div>
                    <div className="flex-row fieldContainer">
                        <span className='fieldDesc'>Enter the room code:</span>
                        <input type="text" className='fieldInp' value={roomCode}
                            onChange={handleRoomCodeChange} autoComplete='off' />
                    </div>
                    <button type="submit" onClick={handleSubmit} className='lianBtn'>Join</button>
                </form>
            </div>
        </div>
    )
}

export default JoinRoom