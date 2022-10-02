import { Link} from 'react-router-dom'
import {useMutation, useApolloClient, useQuery} from '@apollo/client'
import {FIND_POST} from './quarries.js'
import DisplayPost from './displayPost.js'
import { useState, useEffect } from 'react'
import DashPost from './post.js'

function ViewPost ({postToShow}) {
const [id, setId] = useState('')
    const {error, data} = useQuery(FIND_POST, {variables:{id}})
    const [post, setPost] = useState('')

    useEffect(() => {
        if(data){
           setPost(data.findPost)
        }
        if(error){

        }
    }, [data, error])
    
    if(id){
        return(
            <div className='mainView'>
                <div className="profileHeader">
                      <div onClick={() => setId('')}>
                          <span className="material-symbols-outlined">
                              arrow_back
                          </span>
                      </div>
    
                     <h2 className='profileName'>Hola</h2>
                </div>
              { post && <div className='viewPost'>
                    <div className='commentTo'>
                   { post.commentTo && <DisplayPost postToShow={[post.commentTo]} setId ={setId}/>}
                        <div className='linkPost'></div>
                    </div>
                    <div>
                        <DisplayPost postToShow={[post]} setId = {setId}/>
                    </div>
                    <h3>Comments</h3>
                    <div className='postComments'>
                        <DisplayPost postToShow={post.comments} setId = {setId}/>
                    </div>
                </div>}
            </div>
        )
    }

    return(
        <div className='displayView'>
            <DisplayPost postToShow={postToShow} setId = {setId}/>
        </div>
    )
  
   
}

export default ViewPost