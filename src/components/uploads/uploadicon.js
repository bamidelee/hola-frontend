import {useState, useEffect, useContext} from 'react'
import {PROFILE_PIC, USER_DETAILS} from '../quarries'
import {useMutation, useApolloClient} from '@apollo/client'
import defaultIcon from '../../images/nopicpic.jpeg'
import defaultBackImage from '../../images/backimage.jpg'
import UserContext from '../../usercontext'
import axios from 'axios'
import '../../styles/uploadicon.css'
import { selectionSetMatchesResult } from '@apollo/client/cache/inmemory/helpers'
import loading_2 from '../../images/Loading_2.gif'


function Profile ({style, setFilter}) {
    const [error, setError] = useState('')
    const [image, setImage] = useState('')
    const [bio, setBio] = useState('')
    const [backImage, setBackImage] = useState('')
    const context = useContext(UserContext)
    const {user, profileUpload} = context
    const [mainUser, SetMainUser] = user
    const [, setShowProfileUpload] = profileUpload
    const [name, setName] = useState('')
    const client = useApolloClient()
    const [loading, setLoading] = useState(false)
  

    useEffect(() => {
        
        if(mainUser.name){
            setName(mainUser.name)
        }
        if(mainUser.bio){
            setBio(mainUser.bio)
        }
    }, [mainUser])
    const [profile, result] = useMutation(PROFILE_PIC, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        }
    })
    useEffect(() =>{
       setFilter('brightness(70%)')
    },[])
    
    const submit = async(e) =>{
        e.preventDefault()

        let response;
        let response2;
        if(image){
            const formData = new FormData()
        formData.append('file', image)
        formData.append('upload_preset', 'ij8swikr')
        setLoading(true)
         response = await axios.post(`https://api.cloudinary.com/v1_1/dmh70j1wn/image/upload`, formData)
            setLoading(false)
        }
        
        if(backImage){
            const formData2 = new FormData()
            formData2.append('file', backImage)
            formData2.append('upload_preset', 'ij8swikr') 
            setLoading(true)
            response2 = await axios.post(`https://api.cloudinary.com/v1_1/dmh70j1wn/image/upload`, formData2)
            setLoading(false)
        }
      
        await profile({variables: {icon: image? response.data.url : mainUser.icon? mainUser.icon : defaultIcon, backImage: backImage? response2.data.url : mainUser.backImage? mainUser.backImage: defaultBackImage , bio, name}})
        close()
    }

    const refetch = async ()=>{
        await client.refetchQueries({
          include: [USER_DETAILS],
        });
      }
    useEffect(() => {
        if(result.data){
            refetch()
            const NewResult = result.data.profile
            SetMainUser({...mainUser,...NewResult})
        }
    },[result])

    const close = (e) => {
        setShowProfileUpload(false)
        setFilter('brightness(100%)')
    }

    return(
        <div className='UI' style={style}>
             <form onSubmit={submit}>
                 <div className="UIheader">
                     <span className="material-symbols-outlined" onClick={close}>
                        close
                     </span>
                     <h2>Edit profile</h2>
                     <button type='submit'>Save</button>
                     { result.loading || loading ? <img src={loading_2} alt= 'loading' className=' loading'/>: null}
                 </div>
                 <div className='backImage'>
                    <label htmlFor="backImage">
                        < img src = {  backImage? URL.createObjectURL(backImage): mainUser.backImage? mainUser.backImage : defaultBackImage } alt= 'wallpaper' className='wallpaper'/>
                        
                        <span className="material-symbols-outlined UIsymbol">
                            photo_camera
                        </span>
                    </label>
                    <input type='file' alt='upload profile pic'  onChange={({target}) => setBackImage(target.files[0])} id='backImage' accept="image/*"/>
                 </div>
                 <div className='UIIconContainer' style={style}>
                     <label htmlFor= 'icon'>
                       <img src = { image? URL.createObjectURL(image): mainUser.icon? mainUser.icon : defaultIcon } alt='profile' className='UIicon'/>

                        <span className="material-symbols-outlined">
                            photo_camera
                        </span>
                     </label>
                    <input type='file' alt='upload profile pic'  onChange={({target}) => setImage(target.files[0])} id='icon' accept="image/*"/>
                 </div>
                 <div className='details' style={style}>
                    <div>
                        <input id='name' placeholder=' ' style={style} onChange={({target}) => setName(target.value)} value={name}/>
                        <label htmlFor='name'>Name</label>
                    </div>
                    <div>
                        <input id='bio' placeholder=' ' style={style} onChange={({target}) => setBio(target.value)} value={bio}/>
                        <label htmlFor='bio'>Bio</label>
                    </div>
                 </div>
             </form>
        </div>
    )
}

export default Profile