import {useQuery, useMutation, useApolloClient} from '@apollo/client'
import {UserContext} from '../usercontext.js';
import { DASH_POST } from './quarries.js';
import {useState, useContext, useEffect} from 'react'
import ViewPost from './viewPost.js';
import {CREATE_POST} from './quarries.js'
import CreatePost from './uploads/createpost.js';
import '../styles/dashpost.css'

function DashPost () {
    const {user} = useContext(UserContext)
    const [mainUser, setMainUser] = user
    const {error, data} = useQuery(DASH_POST, {variables:{username: mainUser.username}})
    const client = useApolloClient()

    useEffect(() => {
        if(data){
            setMainUser({...mainUser, dashPost: data.dashPost})
        }
      
    }, [data])

    const refetch = async ()=>{
        await client.refetchQueries({
          include: [DASH_POST]
        });
      }

      useEffect(() =>{
        refetch()
      })

  
  if(!mainUser.dashPost){
    return(
        <div>
            Nothing to show
        </div>
    )
  }
    return(
       <div>
        <ViewPost postToShow={mainUser.dashPost}/>
       </div>
    )
}

export default DashPost