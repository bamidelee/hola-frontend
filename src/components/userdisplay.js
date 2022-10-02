import { Link } from "react-router-dom";
import {UserContext} from '../usercontext.js';
import {useContext} from 'react'
import defaultIcon from '../images/nopicpic.jpeg'


function UserDisplay({user}){
    const {style} = useContext(UserContext)
    const [mainStyle] = style

    return(
        <div>
           {user.slice().reverse().map((notification) => 
             <Link to={`profile/${notification.username}`} style={mainStyle} className='notification' key={notification._id}>
                 <img src={notification.icon || defaultIcon} alt ={notification.username} className='icon'/>
                <div>
                    <div className='userDetails'>
                        <span className="postName" >{notification.name}{notification.verified && <span className="material-symbols-outlined verified">verified</span>}</span>
                        <span className='postUsername'>@{notification.username}</span>
                    </div>
                    <div className="userBio">{notification.bio}</div>
                </div>
            </Link>)}
        </div>
    )
}

export default UserDisplay