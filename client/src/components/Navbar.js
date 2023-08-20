import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./Navbar.css"
import {UserContext} from "../App"
import M from "materialize-css"
import {Avatar} from "@mui/material"
import axios from 'axios'

function Navbar() {
  const [userDetail,setUser]=useState(null)
  const [search,setSearch]=useState("")
  const navigate=useNavigate()
  const searchModal=useRef()
  const {state,dispatch}=useContext(UserContext)
const [toggle,setToggle]=useState(false)
 const [screenWidth,setScreenWidth]=useState(window.innerWidth)
function Toggle(){
  setToggle(!toggle)
}
useEffect(()=>{
  const changeWidth=()=>{
    setScreenWidth(window.innerWidth)
  }
  window.addEventListener("resize",changeWidth)
  return ()=>{
    window.removeEventListener("resize",changeWidth)
  }
},[])

useEffect(()=>{
  M.Modal.init(searchModal.current)
},[])
  const renderList=()=>{
    if(state){
      return (
        <> 
        <li><i data-target="modal1" style={{color:"black",marginLeft:"20px"}} className='modal-trigger material-icons'>search</i></li>
        <li ><Link  to="/profile">Profile</Link></li>
        <li ><Link  to="/create">Create Post</Link></li>
        <li ><Link  to="/myfollowingspost">My <strong>Following</strong> Posts</Link></li>
        <li>
        <button style={{marginLeft:"10px", fontWeight:"600"}} className='btn #c62828 red darken-1' onClick={()=>{
          localStorage.clear()
          dispatch({type:"CLEAR"})
          navigate("/signin")
        }}>Logout</button>
        </li>
        </>
      )
    }
    else{
    return (
      <><li><Link to="/signin">Login</Link></li><li><Link to="/signup">Sign Up</Link></li></>
    )
  }
  }
  function fetchUser(query){
    setSearch(query)
    axios.post("/searchuser",{query})
    .then(res=>{
      setUser(res.data.user)
    })
  }
 
  return (
    
  
      <nav> 
    <div className="app_navbar nav-wrapper white">
      <Link  to={state?"/":"/signin"} className="brand-logo left ">ChatVibe</Link>
      {(toggle||screenWidth>1000)&&<ul id="nav-mobile" className="list right hide-on-med-and-down ">
        {renderList()}
      </ul>}
      <i onClick={Toggle} className='button material-icons'>menu</i>

      <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
    <div className="modal-content">
      <input placeholder=' search users' type="text" onChange={(e)=>fetchUser(e.target.value)}/>
      <ul className="collection">
      {userDetail!==null&&userDetail.map(item=>{
       return <Link key={item._id} to={state._id!==item._id?"/profile/"+item._id:"/profile"} onClick={()=>{
         M.Modal.getInstance(searchModal.current).close()
         setSearch("")
       }}> <li className='collection-item'><Avatar style={{float:"left",marginRight:"13px"}} alt={item.name} src={item.pic} /> {item.email}</li></Link>
      })}
      
    </ul>
    </div> 
  
    <div className="modal-footer">
      <button  className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch("")}>Clear</button>
    </div>
  </div>
    </div>
  </nav>

  


  
  )
}

export default Navbar