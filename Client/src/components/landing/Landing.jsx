import React from 'react'
import "./Landing.css"
import LogoAndSlogan from '../logoAndslogan/LogoAndSlogan'
import { NavLink } from 'react-router-dom';
function Landing() {
  return (
    <div className='landing-container flex-column'>
      <LogoAndSlogan />
      <div className="joinButtons flex-column flex-center">
        <NavLink to="/joinRoom" className="lianBtn flex-center">
          Join room
        </NavLink>
        <NavLink to="/createRoom" className="lianBtn flex-center">
          Create room
        </NavLink>
      </div>
    </div>
  )
}

export default Landing