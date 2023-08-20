import React, { createContext,useContext,useEffect,useReducer } from "react"
import './App.css';
import Navbar from "./components/Navbar";
import {BrowserRouter,Routes,Route, useNavigate, useLocation} from "react-router-dom"
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import Profile from "./components/screens/Profile";
import Createpost from "./components/screens/Createpost";
import UserProfile from "./components/screens/UserProfile";
import SubscribeUserPosts from "./components/screens/SubscribeUserPosts";
import { initialState,reducer } from "./reducers/userReducer";
import EditProfile from "./components/screens/EditProfile";
import Reset from "./components/screens/Reset";
import Newpassword from "./components/screens/Newpassword";
import FollowersList from "./components/screens/FollowersList";
import FollowingList from "./components/screens/FollowingList";
 export const UserContext=createContext()
function Routing(){
  const {state,dispatch}=useContext(UserContext)
  const navigate=useNavigate()
  const location=useLocation()
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user"))
    if(user)
    {
      dispatch({type:"USER",payload:user})
    }
    else
    {
      if(!location.pathname.startsWith("/reset"))
      navigate("/signin")
    }
  },[])
  return (
  <Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/signin" element={<Login/>}/>
  <Route path="/signup" element={<Signup/>}/>
  <Route exact path="/profile" element={<Profile/>}/>
  <Route path="/create" element={<Createpost/>}/>
  <Route path="/profile/:userid" element={<UserProfile/>}/>
  <Route path="/myfollowingspost" element={<SubscribeUserPosts/>}/>
  <Route path="/editprofile" element={<EditProfile/>}/>
  <Route path="/reset" element={<Reset/>}/>
  <Route exact path="/reset/:token" element={<Newpassword/>}/>
  <Route path="/followerlist/:userid" element={<FollowersList/>}/>
  <Route path="/followinglist/:userid" element={<FollowingList/>}/>
</Routes>
  )
}
function App() {
  const [state,dispatch]=useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
    <BrowserRouter>
       <Navbar/>
       <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
    
  );
}

export default App;
