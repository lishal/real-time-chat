import React from 'react'
import "./PageNotFound.css"
import LogoAndSlogan from '../logoAndslogan/LogoAndSlogan'
import { NavLink } from 'react-router-dom';
function PageNotFound() {
    return (
        <div className='pageNotFound-container flex-column'>
            <LogoAndSlogan />
            <div className="pageNotFound-content flex-column">
                <span>I think you are on the wrong track!</span>
                <div className="joinButtons flex-column flex-center">
                    <NavLink to="/joinRoom" className="lianBtn flex-center">
                        Join room
                    </NavLink>
                    <NavLink to="/createRoom" className="lianBtn flex-center">
                        Create room
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default PageNotFound