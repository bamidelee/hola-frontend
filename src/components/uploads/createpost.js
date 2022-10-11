import {useState, useContext, useEffect} from 'react'
import {CREATE_POST} from '../quarries.js'
import {useMutation} from '@apollo/client'
import {UserContext} from '../../usercontext.js';
import defaultIcon from '../../images/nopicpic.jpeg'
import '../../styles/createpost.css'
import loading_2 from '../../images/Loading_2.gif'
import {formatDistanceToNowStrict} from 'date-fns'
import axios from 'axios'
function CreatePost ({ placeholder, post, setShowPost, setPost}) {
    const {user, filter, poster, style} = useContext(UserContext)
    const [mainUser, setMainUser] = user
    const [, setFilter] = filter
    const [mainStyle] = style
    const [error, setError] = useState('')
    const [text, setText] = useState('')
    const [media, setMedia] = useState(null)
    const [mediaType, setMediaType] = useState('')
    const [loading2, setloading] = useState(false)

    
    const [createPost, result] = useMutation(CREATE_POST, {
        onError: (error) => {
            console.log(error)
            console.log(error.graphQLErrors[0].message)
           setError(error.graphQLErrors[0].message)
        }
    })
    const submit = async (e) => {
        e.preventDefault()
        let response
        setloading(true)
        if(mediaType === 'image'){
        const formData = new FormData()
        formData.append('file', media)
        formData.append('upload_preset', 'ij8swikr')
         response = await axios.post(`https://api.cloudinary.com/v1_1/dmh70j1wn/image/upload`, formData)
        
        }
        if(mediaType === 'video'){
        const formData = new FormData()
        formData.append('file', media)
        formData.append('upload_preset', 'ij8swikr')
         response = await axios.post(`https://api.cloudinary.com/v1_1/dmh70j1wn/video/upload`, formData)
        
        }
        setloading(false)
        const followers = mainUser.followers.map((user) => user.username)
        await createPost({variables:{media:response? response.data.url : null, text, followers: [...followers, mainUser.username], mediaType, commentTo: post? post._id : null}})
        setShowPost(false);
         setFilter('brightness(100%)'); 
         if(post){
            setPost(null)
         }
    }

    
    useEffect(()=>{
        if(result.data){
           
           if(post){
            setPost(null)
            setShowPost(false)
        }
        }
    },[result.data])

    useEffect(() =>{
        setFilter('brightness(70%)')
        return () => setPost(null)
    }, [])


    return(
        <div className='createPost' style={{...mainStyle}}>
              <span className="material-symbols-outlined formClose" onClick={(e) => {setShowPost(false); setFilter('brightness(100%)'); post && setPost(null)}}>
                    close
                </span>
             {post && <div className="section">
                  <div className='commentLeft'>
                      <img src={post.from.icon || defaultIcon} alt='original post' className='icon'/>
                      <div className='commentLink'></div>
                  </div>
                  <div>
                  <div className='postHead'>
                        <span className="postName">{post.from.name}{post.from.verified && <span className="material-symbols-outlined verified">verified</span>}</span>
                        <span className='postUsername'>@{post.from.username}</span>
                        <span className='postTime'>{formatDistanceToNowStrict(post.date)}</span>
                    </div>
                    {post.text && <div>{post.text}</div>}
                  </div>
              </div>}
              <div className='section'>
              <img src={mainUser.icon||defaultIcon} alt='icon' className='icon'/>
                <form onSubmit={submit}>
                    <div>
                        <div>
                            {error}
                        </div>
                        
                    </div>
                    <textarea rows='10' cols='20'  value={text} placeholder={placeholder} onChange={({target}) => setText(target.value)} maxLength='250' minLength='1' style={mainStyle}>
                    </textarea>
                    {media && <div className='uploadMedia'>
                        {mediaType ==='image'?<img src={URL.createObjectURL(media)} alt='uploaded' className='upladeIMG'/> : null}
                        {mediaType === 'video'? <video src={URL.createObjectURL(media)} autoPlay muted></video> : null}
                            <span className="material-symbols-outlined formClose" onClick={(e) => setMedia(null)}>
                                close
                            </span>
                        </div>}
                    <div className="CPFooter">
                        <input type='file' accept='video/*,image/*' id='gallery' onChange={({target}) => { if(target.files[0].type.includes('image')){
                             setMediaType('image')
                        }
                        else if(target.files[0].type.includes('video')){
                                setMediaType('video')
                            }; setMedia(target.files[0]); 
                            target.value = media 
                      }}/>
                        <label htmlFor="gallery">
                            <span className="material-symbols-outlined formClose">
                                imagesmode
                            </span>
                        </label>
                        <button type='submit' className='CPButton'>
                            Hola
                        </button>
                       { result.loading || loading2 ? <img src={loading_2} alt= 'loading' className=' loading'/>: null}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreatePost