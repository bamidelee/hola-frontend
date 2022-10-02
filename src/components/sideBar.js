import { Link} from "react-router-dom";
function SideBar ({logout, style, setShowPost, homeNotification, setHomeNotification,home, user, width, setBarWidth, messageNotification, setMessageNotification}){
     return (
        <div className='layoutLeft' style={{...style, width}}>
               
                <Link to='/' style={style} className='link' onClick={(e) =>{  setHomeNotification(false); home.current.scrollTop = 0; window.innerWidth < 751 &&setBarWidth('0px')}} >
                        <span className="material-symbols-outlined">
                            home
                           {homeNotification && <span className='dot'></span>}
                        </span>
                        Home
                </Link>
                <Link to='notification' style={style} className='link' onClick={(e) => window.innerWidth < 751 &&setBarWidth('0px')}>
                    <span className="material-symbols-outlined">
                        Notifications
                      { homeNotification && messageNotification? <span className='dot'></span> : null}
                    </span>
                    Notifications
                </Link>
                <Link to='messages' style={style} className='link' onClick={(e) => {window.innerWidth < 751 && setBarWidth('0px'); setMessageNotification(false)}}>
                    <span className="material-symbols-outlined">
                        mail
                        { messageNotification && <span className='dot'></span>}
                    </span>
                    Messages
                </Link>
                <Link to={`profile/${user.username}`} style={style} className='link' onClick={(e) => window.innerWidth < 751 &&setBarWidth('0px')}>
                    <span className="material-symbols-outlined">
                        person
                    </span>
                    Profile
                </Link>
                <Link to='search' style={style} className='link' onClick={(e) => window.innerWidth < 751 &&setBarWidth('0px')}>
                    <span className="material-symbols-outlined">
                      search
                    </span>
                   Search
                </Link>
                <button className='holaButton' onClick={(e) => {setShowPost(); window.innerWidth < 751 &&setBarWidth('0px')  }}>
                    Hola
                </button>
                <Link to='/'>
                    <button onClick={logout} className='logOut' style={style}>
                        Log out
                    </button>
                </Link>
            </div>
     )
}

export default SideBar