import React, { useRef } from 'react';
import "./CreateRoom.css"
import LogoAndSlogan from '../logoAndslogan/LogoAndSlogan'
import copySvg from "../../assets/svg/copySvg.svg"
function CreateRoom() {
    const textRef = useRef(null);
    const copyRoomCode = () => {
        textRef.current.select();
        document.execCommand('copy');
        const tooltip = document.getElementById("tooltip");
        tooltip.innerHTML = "Copied!";
        setTimeout(() => {
            tooltip.innerHTML = "Copy text!";
        }, 1000);
    };
    function getRoomCode() {
        const rawcode1 = Math.floor(Math.random() * 9000) + 999;
        const rawcode2 = Math.floor(Math.random() * 9000) + 999;
        const rawcode3 = Math.floor(Math.random() * 9000) + 999;
        const rawcode4 = Math.floor(Math.random() * 9000) + 999;
        const roomCode = `${rawcode1}-${rawcode2}-${rawcode3}-${rawcode4}`
        return roomCode
    }
    return (
        <div className='createRoom-container flex-column'>
            <LogoAndSlogan />
            <div className="createForm">
                <form action="#" className=" flex-center flex-column inputForm">
                    <div className="flex-row fieldContainer">
                        <span className='fieldDesc'>Enter your name:</span>
                        <input type="text" className='fieldInp' />
                    </div>
                    <div className="flex-row fieldContainer">
                        <span className='fieldDesc'>Enter your room name:</span>
                        <input type="text" className='fieldInp' />
                    </div>
                    <div className="flex-row fieldContainer">
                        <span className='fieldDesc'>Your room code is:</span>
                        <div className='codeField' >
                            <input ref={textRef} id="roomId" value={getRoomCode()} readOnly />
                            <img src={copySvg} alt="copyText" className='copySvg' onClick={copyRoomCode} />
                            <span className="tooltip flex-center" id="tooltip">Copy text!</span>
                        </div>
                    </div>
                    <button type="submit" className='lianBtn'>Create</button>

                </form>
            </div>
        </div>
    )
}

export default CreateRoom