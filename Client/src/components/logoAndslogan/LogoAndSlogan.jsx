import React from 'react'
import "./LogoAndSlogan.css"
import businessLogo from "../../assets/lian.png";

function LogoAndSlogan() {
    return (
        <div className="businessContainer flex-column flex-center">
            <img className='businessLogo' src={businessLogo} alt="businessLogo" />
            <div className="bussinessSlogan">
                <span>It's time to connect with your loved ones.</span>
            </div>
        </div>
    )
}

export default LogoAndSlogan

