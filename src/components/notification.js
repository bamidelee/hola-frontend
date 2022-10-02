
import {useState, useContext, useEffect} from 'react'

import { Link } from "react-router-dom";
import {UserContext} from '../usercontext.js';
import '../styles/notification.css'
import defaultIcon from '../images/nopicpic.jpeg'
function Notification () {
  
    const {style, user, notification} = useContext(UserContext)
    const [mainStyle] = style
    const [notifications] = notification
   const [mainUser] = user



    if(notifications.length < 1){
        return(
            <div className='nothing'>
                Nothing to show
            </div>
        )
    }

    return(
        <div>
            {notifications.slice().reverse().map((notification) => 
             <Link to={`profile/${notification.username}`} style={mainStyle}>
                <div className='notification' key={notification._id}>
                    <img src={notification.icon || defaultIcon} alt ={notification.username} className='icon'/>
                    <span className="postName" >{notification.name}{notification.verified && <span className="material-symbols-outlined verified">verified</span>}</span>
                    <span className='postUsername'>@{notification.username}</span>
                    <span>{notification.text}</span>
                </div>
            </Link>)}
            
        </div>
    )
   
}

export default Notification