import React from 'react'
import LogoAndSlogan from '../logoAndslogan/LogoAndSlogan'
import "./JoinRoom.css"
function JoinRoom() {
    return (
        <div className='joinRoom-container flex-column'>
            <LogoAndSlogan />
            <div className="joinForm">
                <form action="#" className=" flex-center flex-column inputForm">
                    <div className="flex-row fieldContainer">
                        <span className='fieldDesc'>Enter your name:</span>
                        <input type="text" className='fieldInp' />
                    </div>
                    <div className="flex-row fieldContainer">
                        <span className='fieldDesc'>Enter the room code:</span>
                        <input type="text" className='fieldInp' />
                    </div>
                    <button type="submit" className='lianBtn'>Join</button>
                </form>
            </div>
        </div>
    )
}

export default JoinRoom