import { Link} from 'react-router-dom'
import {UserContext} from '../usercontext.js';
import {useState, useContext, useEffect} from 'react'
import  Search  from './search';


function SearchPage () {
    const {style, user} = useContext(UserContext)
    const [mainStyle] = style


    return(
        <div>
              <div className="profileHeader">
                    <Link to='/' style={mainStyle}>
                        <span className="material-symbols-outlined" style={mainStyle}>
                            arrow_back
                        </span>
                    </Link>
            </div>   
            <Search/> 
        </div>
    )
}

export default SearchPage