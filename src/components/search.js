import {useState, useContext, useEffect} from 'react'
import {UserContext} from '../usercontext';
import {useLazyQuery} from '@apollo/client'
import {SEARCH_USER} from './quarries'
import '../styles/search.css'
import UserDisplay from './userdisplay';


function Search () {
    const {style} = useContext(UserContext)
    const [mainStyle] = style
    const [search, setSearch] = useState('')
    const [searchUsers, {data}] = useLazyQuery(SEARCH_USER)


    return (
        <div>
              <input onChange={({target}) => {setSearch(target.value); searchUsers({variables:{username: target.value}})}} value={search}  className='userSearch'placeholder='Search Hola' style={mainStyle}/>
             { search && <div className='searchContent'>
              {data && <div>{data.searchUsers.length < 1? 'No user found' : null}</div>}
              {data && <UserDisplay user = {data.searchUsers}/> }
              </div>}
        </div>
    )
}

export default Search