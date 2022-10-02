import {useState, useEffect, useContext} from 'react'
import {useMutation, useQuery} from '@apollo/client'
import  {SIGN_IN}  from '../quarries';
import logo from '../../images/logoicon.png'
import '../../styles/signInForm.css'
import UserContext from '../../usercontext';
import { USER_DETAILS } from '../quarries';
import loading_2 from '../../images/Loading_2.gif'

function SignInForm ({setToken, close, signUp, setUser}){
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [Error, setError] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const context= useContext(UserContext)
    const {user, profileUpload} = context
    const [mainUser, setMainUser] = user
    const [loading2, setLoading2] = useState(false)
    const [, setShowProfileUpload] = profileUpload
    const   {data, error} = useQuery(USER_DETAILS, {
       variables: {username}
    })
    const [signIn, signInResult] = useMutation(SIGN_IN, {
        onError: (error) => {
            setError(error.graphQLErrors[0].message)
        }, 
    })

   
    useEffect(() =>{
        if(signInResult.data){
            setShowProfileUpload(false)
            setToken(signInResult.data.signIn.value)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [signInResult])


    const submit = (event) =>{
        event.preventDefault()
        signIn({ variables: {username, password}})  
     
    }
    useEffect(()=> {
        if(data){
           
            setMainUser(data.findUser)
        }
        if(error){
        }
    }, [data, error])


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
                {Error}
            </div>
            <h1> Sign in to Holla</h1>
            <form action="" onSubmit={submit}>
                <div>
                    <div className='formDiv'>
                        <input type='text' onChange={({target}) => setUserName(target.value)} onInput={validateUsername} required pattern='^[A-Za-z0-9_]{1,15}$' value={username} id='username' className='formInput' placeholder=' '/>
                        <label htmlFor= 'username' className='formLabel'>Username</label>
                    </div>
                    <div className='formError'>{usernameError}</div>
                    <div className='formDiv'>
                        <input type='password' onChange={({target}) => setPassword(target.value)} required pattern='^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$' value={password} onInput={validatePassword} id='password'  className='formInput' placeholder=' '/> 
                        <label htmlFor= 'password' className='formLabel'>Password</label>
                    </div>
                    <div className='formError'>{passwordError}</div>
                    <button className='formButton' type='submit' >Submit</button>
                    {  signInResult.loading ? <img src={loading_2} alt= 'loading' className=' loading'/>: null}
                </div>

                <div>
                    <div className='signInFooter'>
                        Don't have an account?
                    </div>
                    <button onClick={signUp} className='signInToSignUp'>
                        Sign up
                    </button>
                </div>
            </form>
        </div>
    )
}
export default SignInForm