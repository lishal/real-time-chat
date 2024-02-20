import React from 'react'
import "./Landing.css"
import LogoAndSlogan from '../logoAndslogan/LogoAndSlogan'

function Landing() {
  return (
    <div className='landing-container flex-column'>
      <LogoAndSlogan />
      <div className="joinButtons flex-column flex-center">
        <button type="button">Join room</button>
        <button type="button">Create room</button>
      </div>
    </div>
  )
}

export default Landing