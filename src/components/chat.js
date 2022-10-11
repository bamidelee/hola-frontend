import {TEXT, USER_DETAILS} from './quarries'
import {useMutation, useQuery, useApolloClient} from '@apollo/client'
import {UserContext} from '../usercontext.js';
import{ format,parseISO} from 'date-fns'
import axios from 'axios'
import {useState, useContext, useEffect, useRef} from 'react'
import {Link, useParams} from 'react-router-dom'
import '../styles/chat.css'

function Chat ({receiver, setReceiver, buddy}) {
    const {user,  style, home} = useContext(UserContext)
    const [mainUser, setMainUser] = user
    const [mainStyle] = style
    const client = useApolloClient()
    const [text, setText] = useState('')
    const [mediaType, setMediaType] = useState('')
    const [media, setMedia] = useState('')
    const {error, data} = useQuery(USER_DETAILS, {variables:{username: mainUser.username}})
    const [Messages, setMessages] = useState([])
    const [Text, result] = useMutation(TEXT, {
        onError: (error) => {
            console.log(error)
            console.log(error.graphQLErrors[0].message)
        }
    })

    const chatDown = useRef()
    const textArea = useRef()

    useEffect(() => {
        if(data){
            setMainUser(data.findUser)
        }
      
    }, [data])

    const refetch = async ()=>{
        await client.refetchQueries({
          include: [USER_DETAILS]
        });
      }

      useEffect(() =>{
        refetch()
      }, [])
    useEffect(()=> {
        setMessages(mainUser.messages.filter((message) => message.sender.username === buddy.username || message.receiver.username === buddy.username))
        console.log(Messages)
    },[mainUser])

    const submit = async (e) => {
        e.preventDefault()
        setMessages(Messages.concat({ text, sender: mainUser, mediaType, date:  Date.now(), _id: new Date(), receiver: buddy, media:  mediaType? URL.createObjectURL(media): null}))
        console.log('oooooo')
        setText('')
        setMediaType('')
        textArea.current.textContent =''
        setTimeout(() => chatDown.current.scrollIntoView({behavior: 'smooth'}) , 500)
        chatDown.current.scrollIntoView({behavior: 'smooth'})
        let response
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
        console.log('aaaa')
        setText('')
        setMediaType('')
        textArea.current.textContent =''
        await Text({variables:{mediaType, text, receiver, sender: mainUser._id, media:  response? response.data.url: null}})
    }

    useEffect(() =>{
        chatDown.current.scrollIntoView({behavior: 'smooth'})
    }, [])

    useEffect(() => {
        if(mediaType){
            textArea.current.style.paddingTop ='4rem'
        }

        else{
            textArea.current.style.paddingTop = '10px'
        }
    }, [mediaType])

    useEffect(()=> {
        if(result.data){

        }
        if(result.error){
            console.log(result)
        }
    }, [result.data])

    return(
        <div className = 'chat'>
          { buddy && <div className='chatHead' style={mainStyle}>
                    <span className="material-symbols-outlined formClose" onClick={() => setReceiver('')} >
                            arrow_back
                    </span>
               
                <div>
                    <h2 className='profileName'>{buddy.name}{buddy.verified && <span className="material-symbols-outlined profileVerified">verified</span>}</h2>
                    <div className='postUsername'>@{buddy.username}</div>
                </div>
            </div>}
            {<div className='conversation' >
                {Messages.map((message) => 
                 <div  key={message._id}  className={message.sender.username === mainUser.username? 'to' : 'from'}>
                     <div className='chatText'>
                    {message.mediaType && <div>
                         {message.mediaType === 'image'? <img src={message.media} alt='message' className='conversationImage'/>
                         : <video src={message.media} controls className='conversationVideo'></video>
                          }
                     </div>}
                        { message.text}
                    </div>
                    <div className='chatDate'>{format(message.date,'iii  p')}</div>
                 </div>)}
                 <div ref={chatDown}></div>
            </div>}
          
            <form onSubmit={submit} style={mainStyle} id='talk'>
                <input type='file' accept='video/*,image/*' id='gallery' onChange={({target}) => { if(target.files[0].type.includes('image')){
                             setMediaType('image');
                        }
                        else if(target.files[0].type.includes('video')){
                                setMediaType('video')
                            }; setMedia(target.files[0]); 
                            home.current.scrollTop += 40
                      }}/>
                <label htmlFor="gallery">
                    <span className="material-symbols-outlined formClose">
                        imagesmode
                    </span>
                </label>
                <div className='chatContainer'>
                {mediaType &&<div className='sendImageContainer'>
                        { mediaType === 'image' && <img src={URL.createObjectURL(media)} alt = 'message' className='sendImage'/>}
                        {mediaType === 'video' && <video src = {URL.createObjectURL(media)} autoPlay muted></video>}
                         <span className="material-symbols-outlined sendImageClose" onClick={() => setMediaType(null)}>
                            close
                         </span>
                    </div>}
                    <div  className = 'textarea' contentEditable= 'true'  onInput={({target}) => {setText(target.textContent); home.current.scrollTop += 40}}  placeholder='Start a message' style={mainStyle} form='talk' ref={textArea} >
                    
                    </div>
                </div>
                <button>
                <span className="material-symbols-outlined formClose"  >
                          send
                    </span>
                </button>
            </form>
        </div>
    )
}

export default Chat