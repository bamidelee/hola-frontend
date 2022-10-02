import {useState, useContext, useEffect} from 'react'
import {NEW_MESSAGE} from './quarries.js'
import {useMutation, useQuery, useApolloClient} from '@apollo/client'
import {FOLLOW, USER_DETAILS} from './quarries.js'
import {UserContext} from '../usercontext.js';
import '../styles/createpost.css'
import formatDistanceToNowStrict from 'date-fns'
import axios from 'axios'
import UserDisplay from './userdisplay.js';
import Chat from './chat.js';
import {useParams} from 'react-router-dom'
import defaultIcon from '../images/nopicpic.jpeg'


function Messages () {
    const {id}  = useParams()
    const [receiver, setReceiver] = useState('')
    const {user, style} = useContext(UserContext)
    const [mainUser, setMainUser] = user
    const [contact, setContact] = useState([])
    const [buddy, setBuddy] = useState('')
    const {error, data} = useQuery(USER_DETAILS, {variables:{username:id}})
    const client = useApolloClient()
    const [mainStyle] = style

    const refetch = async ()=>{
        await client.refetchQueries({
          include: [USER_DETAILS]
        }, []);
      }
      

    useEffect(() => {
        if(data){
            data.findUser && setReceiver(data.findUser._id)
           
        }
    }, [data])

    useEffect(()=> {
        if(data){
            data.findUser && setBuddy(data.findUser)
        }
    }, [data])

    useEffect(() =>{
        refetch()
      },[])


   useEffect(() => {
    mainUser.messages.slice().forEach((message) => {

        if(message.sender.username !== mainUser.username && !contact.find((person) => person.username === message.sender.username)){setContact([...contact, message.sender])} 
        else if(!contact.find((person) => person.username === message.receiver.username && message.receiver.username !== mainUser.username)){
            setContact([...contact, message.receiver])
        }})

   }, [mainUser.messages])

   if(receiver){
    return(
        <div>
            <Chat receiver={receiver} setReceiver={setReceiver} buddy={buddy}/>
        </div>
    )
   }

   if(mainUser.messages.length < 1){
    return(
        <div className='nothing'>
           Message somebody
        </div>
    )
   }

    return(
        <div>
            {contact.slice().reverse().map((person) => 
                <div key={person._id} className='contactDetails' onClick={({target}) => {setReceiver(person._id); setBuddy(person)}}>
                     <img src={person.icon || defaultIcon} alt ={person.username} className='icon'/>
                        <div className='userDetails'>
                        <span className="postName" >{person.name}{person.verified && <span className="material-symbols-outlined verified">verified</span>}</span>
                        <span className='postUsername'>@{person.username}</span>
                                         </div>
                    <div className='lastText'>{mainUser.messages.slice().reverse().find((message) => message.sender.username === person.username || message.receiver.username === person.username).text}</div>
                </div>
            )}
        </div>
    )
}

export default Messages