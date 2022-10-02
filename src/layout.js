import React from 'react';
import { useState, useEffect, useRef} from 'react';
import './styles/App.css';
import LogOn from './components/forms/loginform'
import Profile from './components/uploads/uploadicon';
import UserContext from './usercontext';
import { Link, Outlet } from "react-router-dom";
import logo from './images/logoicon.png'
import { useApolloClient, useLazyQuery} from '@apollo/client'
import {useSubscription} from '@apollo/client'
import './styles/layout.css'
import defaultIcon from './images/nopicpic.jpeg'
import CreatePost from './components/uploads/createpost';
import SideBar from './components/sideBar';
import {NEW_MESSAGE, POST_CREATED} from './components/quarries'
import Search from './components/search';

function Layout() {
  const [homeNotification, setHomeNotification] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [token, setToken] = useState(null)
  const [error, setError]  = useState('')
  const [user, setUser] = useState(null)
  const [showProfileUpload, setShowProfileUpload] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
 const [messageNotification, setMessageNotification] = useState(false)
  const client = useApolloClient()
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [filter, setFilter] = useState('none')
  const [postToReply, setPostToReply] = useState(null)
  const [top, setTop] = useState('0')
  const [prevScrollPos, setPrevScrollPos] = useState(1)
  const [barWidth, setBarWidth ] = useState('300px')
  const home = useRef()
  const {data: subscriptionData} = useSubscription(POST_CREATED,{
    variables:{follow: user? user.username: null}
})

  const {data: messageData, error: messageError} = useSubscription(NEW_MESSAGE, {
    variables:{sender: user? user.username: null}
  })
  const [style, setStyle] = useState({
    color: 'black',
    textDecoration:'none',
    backgroundColor: 'white'
  })


  
  useEffect(() => {
    if(subscriptionData){
      if(subscriptionData.newPost.from.username !== user.username){
        setHomeNotification(true)
        const User = subscriptionData.newPost.from
        setNotifications([...notifications, {icon: User.icon, name: User.name, username: User.username, text: "hola'd", id:subscriptionData.newPost._id, verified: User.verified}])
      
      }
    }
   
},[subscriptionData])


const mediaQuery990 = window.matchMedia('(min-width: 750px)')
const mediaQuery700 = window.matchMedia('(max-width: 750px)')

function handleTabletChange(e) {
 
  if (e.matches && barWidth !== '300px') {
  setBarWidth('300px')
  }


}

function handleTabletChange700(e) {
 
  if (e.matches && barWidth !== '0px') {
  setBarWidth('0px')
  }


}
mediaQuery990.addListener(handleTabletChange)
mediaQuery700.addListener(handleTabletChange700)




useEffect(() => {
  if(messageData){
  
      setUser({...user, messages: [...user.messages, messageData.newMessage ]})
      setMessageNotification(true)
      const User = messageData.newMessage.sender
      setNotifications([...notifications, {icon: User.icon, name: User.name, username: User.username, text: `messaged you`, id: messageData.newMessage._id, verified: User.verified}])
  }
  if(messageError){
    console.log(messageError)
  }
}, [messageData, messageError])

const showBar = ({target}) =>{
  
  let currentScrollPos = target.scrollTop;
  if (prevScrollPos >= currentScrollPos) {
   setTop('0')
  } else{
    setTop('-60px')
  }
    setPrevScrollPos(currentScrollPos)
}
 
  useEffect(() =>{
    if(token){
     localStorage.setItem('user-token', token)
    }

    
  }, [token])

  useEffect(() => {
    if(user){
      const USER = JSON.stringify({...user})
      localStorage.setItem('user', USER)
    }
    if(notifications.length > 0){
      const post = JSON.stringify([...notifications])
      localStorage.setItem('notifications', post)
    }
  }, [user, notifications])
  useEffect(() =>{
      const key = localStorage.getItem('user-token')
      const USER2 = localStorage.getItem('user')
      const storageNotification = localStorage.getItem('notifications')
      const notification = JSON.parse(storageNotification)
      const obj = JSON.parse(USER2)
      if(key){
        setToken(key)
      }

      if(USER2){
        setUser({...obj})
      }

      if(storageNotification){
        setNotifications(notification)
      }
      

  }, [])

  useEffect(() =>{
    if(!darkMode){
        setStyle({
            color: 'black',
            textDecoration:'none',
            backgroundColor: 'white'
          })
    }
    else{
        setStyle({
            color: 'white',
            textDecoration:'none',
            backgroundColor: 'black'
          })
    }
  },[darkMode])
  const contextValue = {
    user:[user, setUser], 
    error: [error, setError], 
    profileUpload: [showProfileUpload, setShowProfileUpload],
    filter: [filter, setFilter],
    poster: [showCreatePost, setShowCreatePost],
    style: [style, setStyle],
    postToReply: [postToReply, setPostToReply],
    notification: [notifications, setNotifications],
    home

  }
 if(!token){
  return (
    <UserContext.Provider
    value = {contextValue}>
    <LogOn setToken={setToken}/>
    </UserContext.Provider>
  )
 }

 const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const showPost = (e)=>{
    setShowCreatePost(true)
  }

 
  
 return(
  <UserContext.Provider
    value = {contextValue}>
        <div>
        {showCreatePost && <CreatePost   placeholder="what's happening'" setShowPost={setShowCreatePost} setPost={setPostToReply} post={postToReply}/>}
              {showProfileUpload && <Profile style={style} setFilter={setFilter}/>}
          <div className='layout' style={{...style, WebkitFilter:filter}}>
              <div className='layoutHeader' style={{...style, top}}>
              <img src = {user.icon || defaultIcon } alt='profile' className='icon mainIcon' onClick={() => barWidth === '0px'? setBarWidth('300px'): setBarWidth('0px')}/>
                  <img src={logo} alt='logo' className='layoutLogo'/>
                  <label htmlFor="" className="darkLabel">
                      <input type='checkbox' onChange={(e) => {setDarkMode(!darkMode); }} className='darkMode'/>
                      <span className='slider'></span>
                  </label>
              </div>
              <SideBar logout={logout} style={style} setShowPost={showPost} homeNotification={homeNotification} setHomeNotification={setHomeNotification} user = {user} home={home} width={barWidth} setBarWidth ={setBarWidth} setMessageNotification={setMessageNotification} messageNotification={messageNotification}/>
              <div className='layoutMiddle' onScroll={showBar} ref={home}>
                <Outlet/>
              </div>
              <div className='layoutRight'>
                    <Search/>
              </div>
          </div>
        </div>
    </UserContext.Provider>
 )
}

export default Layout;
