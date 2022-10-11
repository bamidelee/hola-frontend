import {formatDistanceToNowStrict} from 'date-fns'
import {UserContext} from '../usercontext.js';
import {useMutation} from '@apollo/client'
import {useState, useContext, useEffect} from 'react'
import { Link } from "react-router-dom";
import {CREATE_POST, LIKE} from './quarries.js'
import defaultIcon from '../images/nopicpic.jpeg'

function DisplayPost ({postToShow, setId, noLink}){
    const {user, poster, postToReply, style} = useContext(UserContext)
    const [mainStyle] = style
    const [mainUser, setMainUser] = user
    const [PostToReply, SetPostToReply]= postToReply
    const [showCreatePost, setShowCreatePost] = poster
    const [createPost, result] = useMutation(CREATE_POST)
    const [like, likeData] = useMutation(LIKE)
    useEffect(()=>{
        if(result.data){
            const dashPost= mainUser.dashPost.concat(result.data.createPost)
            setMainUser({...mainUser, dashPost})
        }
    },[result.data])


    useEffect(()=> {
        if(likeData.data){
            const dashPost = mainUser.dashPost.map((post) => {if(post._id === likeData.data.like._id){return{...likeData.data.like}}return post})
            setMainUser({...mainUser, dashPost: dashPost})
        }
    }, [likeData.data])

    return(
        <div>
        {postToShow.slice().reverse().map((post) => 
        <div key={post._id} className='dashPost'>
           <Link to = {`profile/${post.from.username}`} state= {{fromDashboard: true}} onClick= {(e) => noLink && e.preventDefault()}><img src={post.from.icon || defaultIcon} alt ={post.from.username} className='icon'/></Link>
            <div>
                {post.commentTo && <div className='postUsername'> replied @{post.commentTo.from.username}</div>}
                <div className='postHead'>
                    <Link to={`profile/${post.from.username}`} className='nameLink' style={{...mainStyle}}><span className="postName" onClick={(e) => noLink && e.preventDefault()} >{post.from.name}{post.from.verified && <span className="material-symbols-outlined verified">verified</span>}</span></Link>
                    <span className='postUsername'>@{post.from.username}</span>
                    <span className='postTime'>{formatDistanceToNowStrict(post.date)}</span>
                </div>
                <div onClick={() => setId(post._id)}>
                    <div>
                        <div className='text'> {post.text}</div>
                      {post.media &&  <div className='media'> {post.mediaType === 'image'? <img src={post.media} alt='post'/>: <video src={post.media} controls></video>}</div>}
                    </div>
                </div>
                    <div className='postButtons'>
                        <button className='comment' onClick={({target}) => { setShowCreatePost(true); SetPostToReply(post)}} >
                        <span className="material-symbols-outlined">
                            chat_bubble
                        </span>
                        <span>
                            {post.comments && post.comments.length}
                        </span>
                        </button>
                        <button onClick={({target}) => {
                            createPost({variables: {text:post.text, media: post.media, mediaType: post.mediaType, followers: [...mainUser.followers, mainUser.username]}});
                            target.classList.add('reposted')
                        }} className='repost'>
                        <span className="material-symbols-outlined">
                           cycle
                        </span>
                        </button>
                        <button className='like' onClick={({target}) => {like({variables:{id:post._id}});target.classList.toggle('liked') }}>
                        <div>
                            <span  className={post.likes.includes(mainUser.username)?'material-symbols-outlined liked': 'material-symbols-outlined'}>
                                favorite
                            </span>
                        </div>
                        <span>
                            {post.likes.length}
                        </span>
                        </button>
                    </div>
            </div>
        </div>
        )}
    </div>
    )
}

export default DisplayPost