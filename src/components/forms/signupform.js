import {useState, useEffect, useContext} from 'react'
import {useMutation, useLazyQuery} from '@apollo/client'
import {SIGNUP} from '../quarries'
import { SIGN_IN, USER_DETAILS } from '../quarries';
import {UserContext} from '../../usercontext';
import logo from '../../images/logoicon.png'
import loading_2 from '../../images/Loading_2.gif'
function SignupForm ({setToken, close}){
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('')
    const [error, setError] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const {user,profileUpload} = useContext(UserContext)
    const [, setShowProfileUpload] = profileUpload
    const [loading2, setLoading2] = useState(false)
    const [, setMainUser] = user
    const  [findUser, {data, loading}] = useLazyQuery(USER_DETAILS)
    const [signUp, signUpResult] = useMutation(SIGNUP, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        }
    })
    const [signIn, signInResult] = useMutation(SIGN_IN, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        }
        
    })
  

    const logIn = async() =>{
       await signIn({variables: {username, password}})
       setLoading2(false)
    }
 
    useEffect(()=>{
        if(data){
         setMainUser(data.findUser)
        }
    }, [data])

    const submit = async(e) => {
        e.preventDefault()
        setLoading2(true)
       await signUp({variables: {username, name, password}})
       setLoading2(false)
       findUser({variables:{username}})
    }

    useEffect(() =>{
       
        if(signUpResult.data){
           logIn()
        }
    }, [signUpResult.data])

    useEffect(() =>{
        if(signInResult.data){
            setToken(signInResult.data.signIn.value)
            setShowProfileUpload(true)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signInResult])

    const validateUsername = (e) => {
        e.preventDefault()
        const {target} = e
        target.customError = true
        if(!target.checkValidity()){
            setUsernameError('invalid username')
            return false
        }
        else{
            setUsernameError('')
        }

        if(username){
            e.target.style.transform = 'scaleY(1)'
           }
    }

    const validatePassword = (e) => {
        e.preventDefault()
        const {target} = e
        target.customError = true
        if(!target.checkValidity()){
            setPasswordError('Password must include "Uppercase, Lowercase and Number"')
        }
        else{
            setPasswordError('')
        }

        if(password){
            e.target.style.transform = 'scaleY(1)'
           }
    }
    const validateName = (e) => {
        e.preventDefault()
        e.target.customError = true
       if(name){
        e.target.style.transform = 'scaleY(1)'
       }
    }
    return(
        <div className='Form'>
              <div className="FormHeader">
                  <span className="material-symbols-outlined formClose" onClick={close}>
                    close
                </span>
                <img src={logo} alt='logo' className='formLogo'/>
              </div>
            <div className='formError'>
                {error}
            </div>
            <h1>Create your account</h1>
            <form action="" onSubmit={submit}>
                <div>
                    <div className='formDiv'>
                        <input type='text' onChange={({target}) => setName(target.value)} id='name' required onInput={validateName} className='formInput' placeholder=' '/>
                        <label htmlFor='name' className='formLabel'>Name</label>
                    </div>
                    <div className='formDiv'>
                        <input type='text' onChange={({target}) => setUserName(target.value)} onInput={validateUsername} required pattern='^[A-Za-z0-9_]{1,15}$' value={username} id='username' className='formInput' placeholder=' '/>
                        <label htmlFor= 'username' className='formLabel'>Username</label>
                        <div className='formError'>{usernameError}</div>
                    </div>
                    <div className='formDiv'>
                        <input type='password' onChange={({target}) => setPassword(target.value)} required pattern='^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$' value={password} onInput={validatePassword} id='password' className='formInput' placeholder=' '/>
                        <label htmlFor= 'password' className='formLabel'>Password</label>
                        <div className='formError'>{passwordError}</div>
                    </div>
                    <button className='formButton'>Submit</button>
                    { loading || loading2 ? <img src={loading_2} alt= 'loading' className=' loading'/>: null}
                </div>
            </form>
        </div>
    )
}
export default SignupForm