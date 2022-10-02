import {useState, useContext, useEffect} from 'react'
import defaultBackImage from '../images/backimage.jpg'
import defaultIcon from '../images/nopicpic.jpeg'
import {UserContext} from '../usercontext.js';
import {useParams, Link} from 'react-router-dom'
import {FOLLOW, USER_DETAILS} from './quarries.js'
import {useMutation, useApolloClient, useQuery} from '@apollo/client'
import DisplayPost from './displayPost.js';
import '../styles/profile.css'
import UserDisplay from './userdisplay.js'


function ProfileDisplay () {
    const {style, user, profileUpload} = useContext(UserContext)
    const [USER, setUSER] = useState('')
    const [, setUploadIcon] = profileUpload
    let {username} = useParams()
    const [mainStyle] = style
   const [mainUser, setMainUser] = user
   const {error, data} = useQuery(USER_DETAILS, {variables:{username}})
   const client = useApolloClient()
   const [followingUSER, setFollowingUser] = useState(false)
   const [follow, followData] = useMutation(FOLLOW)
   const [userFollowers, setUserFollowers] = useState([])
   useEffect(() => {
    if(data){
       setUSER(data.findUser)
    }
    if(error){
        console.log(error)
    }
}, [data, error])

const refetch = async ()=>{
    await client.refetchQueries({
      include: [USER_DETAILS]
    });
  }

  useEffect(() =>{
    refetch()
  },[])

  useEffect(() => {
    if(USER.followers && USER.followers.find((user) => user.username === mainUser.username)){
        setFollowingUser(true)
    }
    else{
        setFollowingUser(false)
    }
  },[USER])

  if(userFollowers.length > 0){
    return  (
        <div>
        <div className="profileHeader">
                  <span className="material-symbols-outlined" onClick={() => setUserFollowers([])}>
                      arrow_back
                  </span>

              <h2 className='profileName'>Profile</h2>
      </div>
      <div>
          <UserDisplay user ={userFollowers}/>
      </div>
  </div>
    )
  }

    return (
        <div className='profileDisplay'>
          <div className="profileHeader">
                    <Link to='/' style={mainStyle}>
                        <span className="material-symbols-outlined" style={mainStyle}>
                            arrow_back
                        </span>
                    </Link>
                    <h2 className='profileName'>{USER.name}{USER.verified && <span className="material-symbols-outlined profileVerified">verified</span>}</h2>
            </div>    
              <div className="profileMain">
                  <div className="profileBackImage">< img src = {  mainUser.backImage? mainUser.backImage : defaultBackImage } alt= 'wallpaper' className='profileWallpaper'/></div>
                  <div className="profileIconContainer" style={mainStyle}><img src = {  mainUser.icon? mainUser.icon : defaultIcon } alt='profile' className='profileIcon'/></div>
                  
                 { mainUser.username !== USER.username &&  <Link to={`messages/${USER.username}`} style={mainStyle} className='profileMessage'>
                      {USER.username &&  <span className="material-symbols-outlined">
                            mail
                        </span>}
                    </Link>}
              
                               {mainUser.username !== USER.username && <button className='followButton' style={mainStyle} onClick={async()=> {setFollowingUser(!followingUSER); await follow({variables:{follower: mainUser._id, following:USER._id}}); refetch()}}>{followingUSER?'Unfollow': 'Follow' }</button>}
                               {mainUser.username === USER.username && <button className='editProfile' style={mainStyle} onClick={() => setUploadIcon(true)}>Edit profile</button>}
            </div>
            <div className='profileInfo'>
                <h2 className='profileName'>{USER.name}{USER.verified && <span className="material-symbols-outlined profileVerified">verified</span>}</h2>
                <p>@{USER.username}</p>
                <div  className='profileBio'>{USER.bio}</div>
                <div className='profileFollow'>
                    <div onClick={() => setUserFollowers([...USER.following])}>{!USER.following? 0 :USER.following.length} <span>Following</span></div>
                    <div onClick={() => setUserFollowers([...USER.followers])}>{!USER.followers? 0 :USER.followers.length} <span>Followers</span></div>
                </div>
            </div>
            <div className='holas'>
                <h2>Holas</h2>
               {USER.posts && <DisplayPost postToShow={USER.posts} noLink={true}/>}
            </div>
        </div>
    )
}

export default ProfileDisplay