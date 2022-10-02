import {useState} from 'react'
import SignupForm from './signupform'
import SignInForm from './signInForm'
import logoName from '../../images/logoname.png'
import logoIcon from '../../images/logoicon.png'
import '../../styles/log.css'

function LogOn({setToken}){
    const [formToShow, setFormToShow] = useState('')
    const [style, setStyle] = useState({
        backgroundColor: 'white'
       
    })
    const close = (e) => {
        setFormToShow('')
        setStyle( {backgroundColor: 'white'})
    }

    
    return(
        <div className='log'>
            <div className="logLeft">
                <img src={logoIcon} alt='logo' className='logoIcon'/>
                <img src={logoName} alt='logo' className='logoName'/>
            </div>
            <div className="logRight" style={style} >
                <div>
                    <h1 className='logH1'>
                        Hola mi familia
                    </h1>
                    <h2 className='logH2'>
                        Join Hola today
                    </h2>
                </div>
                <button onClick={(e) => {setFormToShow('signUp');  setStyle({ backgroundColor: 'grey'})}} className='logSignup'>
                    Sign up
                </button>
               
                <h3>
                    Already have an account?
                </h3>
                <button onClick={(e) => {setFormToShow('signIn');   setStyle({ backgroundColor: 'grey'})}} className='logSignIn'>
                    Sign in
                </button>
               
                <div className='logFooter'>
                    Designed by Olujide Ibrahim
                </div>
            </div>
            {formToShow === 'signUp' && <SignupForm setToken={setToken} close={close}/>}
                {formToShow === 'signIn' && <SignInForm setToken={setToken} close={close} signUp={(e) => setFormToShow('signUp')}/>}
        </div>
    )
}

export default LogOn