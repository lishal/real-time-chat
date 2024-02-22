import React from 'react'
import loadingSvg from "../../assets/svg/loadingSvg.svg"
import "./Loading.css"
function Loading() {
    return (
        <div className='lianLoading'>
            <img src={loadingSvg} alt="Loading" />
        </div>
    )
}

export default Loading