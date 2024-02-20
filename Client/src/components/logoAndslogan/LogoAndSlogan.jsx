import React from 'react'
import "./LogoAndSlogan.css"
import businessLogo from "../../assets/lian.png";
import { NavLink } from 'react-router-dom';
function LogoAndSlogan() {
    return (
        <div className="businessContainer flex-column flex-center">
            <NavLink to="/">
                <img className='businessLogo' src={businessLogo} alt="businessLogo" />
            </NavLink>
            <div className="bussinessSlogan">
                <span>It's time to connect with your loved ones.</span>
            </div>
        </div>
    )
}

export default LogoAndSlogan

