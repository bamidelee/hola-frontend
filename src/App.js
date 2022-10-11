import {
 HashRouter,
  Routes,
  Route,
} from "react-router-dom";

import DashPost from "./components/post.js";
import Notification from "./components/notification.js";
import Layout from "./layout.js";
import ProfileDisplay from "./components/profile.js";
import ViewPost from "./components/viewPost.js";
import Messages from "./components/messages.js";
import SearchPage from "./components/searchPage.js";

function App () {

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element= {<Layout/>}>
          <Route index element={<DashPost/>}/>
          <Route path='notification' element={<Notification/>}/>
          <Route path='profile/:username' element={<ProfileDisplay/>}/>
          <Route path='notification/profile/:username' element= {<ProfileDisplay/>}/>
          <Route path="post/:id" element={<ViewPost/>}/>
          <Route path="messages" element = {<Messages/>}/>
          <Route path="profile/:username/messages/:id" element={ <Messages/>}/>
          <Route path="search" element = {<SearchPage/>}/>
          <Route path="search/profile/:username/messages/:id" element={ <Messages/>}/>
          <Route path='search/profile/:username' element={<ProfileDisplay/>}/>
        </Route>
      </Routes>
    </HashRouter>
  )

}

export default App