import React, { useRef, useState, useEffect } from 'react';
import "./CreateRoom.css"
import LogoAndSlogan from '../logoAndslogan/LogoAndSlogan'
import copySvg from "../../assets/svg/copySvg.svg"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../loading/Loading';
import { useNavigate } from 'react-router-dom';
function CreateRoom() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [roomName, setRoomname] = useState("");
    const [roomCode, setRoomCode] = useState("");
    const textRef = useRef(null);

    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handleRoomnameChange = (event) => {
        setRoomname(event.target.value);
    };
    const copyRoomCode = () => {
        textRef.current.select();
        document.execCommand('copy');
        const tooltip = document.getElementById("tooltip");
        tooltip.innerHTML = "Copied!";
        setTimeout(() => {
            tooltip.innerHTML = "Copy text!";
        }, 1000);
    };

    useEffect(() => {
        const rawcode1 = Math.floor(Math.random() * 9000) + 999;
        const rawcode2 = Math.floor(Math.random() * 9000) + 999;
        const rawcode3 = Math.floor(Math.random() * 9000) + 999;
        const rawcode4 = Math.floor(Math.random() * 9000) + 999;
        setRoomCode(`${rawcode1}-${rawcode2}-${rawcode3}-${rawcode4}`)
    }, []);

    function createBtn(event) {
        event.preventDefault();
        if (name === "" || roomName === "") {
            toast.error("Please fill the form!", {
                theme: "dark",
            })
        }
        else {
            setLoading(true)
            const data = {
                "name": name,
                "roomId": roomCode,
                "roomName": roomName,
                "userId": `${Math.floor(Math.random() * 99)}${Date.now()}`
            }
            fetch(`18.142.128.26/api/createRoom`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {

                    if (response.status === 400) {
                        throw new Error("Something went wrong")
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
                    if (error.message.includes("Something went wrong")) {
                        toast.error("Oops! Something went wrong. Please reload and come back again", {
                            theme: "dark",
                            pauseOnHover: true,
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
    }
    return (
        <div className='createRoom-container flex-column'>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                newestOnTop={true}

            />
            {loading ? <Loading /> : ''}
            <LogoAndSlogan />
            <div className="createForm">
                <form action="#" className=" flex-center flex-column inputForm">
                    <div className="flex-row fieldContainer">
                        <span className='fieldDesc'>Enter your name:</span>
                        <input type="text" className='fieldInp' value={name}
                            onChange={handleNameChange} autoComplete='off' />
                    </div>
                    <div className="flex-row fieldContainer">
                        <span className='fieldDesc'>Enter your room name:</span>
                        <input type="text" className='fieldInp' value={roomName}
                            onChange={handleRoomnameChange} autoComplete='off' />
                    </div>
                    <div className="flex-row fieldContainer">
                        <span className='fieldDesc'>Your room code is:</span>
                        <div className='codeField' >
                            <input ref={textRef} id="roomId" value={roomCode} readOnly />
                            <img src={copySvg} alt="copyText" className='copySvg' onClick={copyRoomCode} />
                            <span className="tooltip flex-center" id="tooltip">Copy text!</span>
                        </div>
                    </div>
                    <button type="submit" className='lianBtn' onClick={createBtn}>Create</button>

                </form>
            </div>
        </div>
    )
}

export default CreateRoom