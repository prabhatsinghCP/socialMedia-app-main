import axios from 'axios'
import React, { useState ,useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import M from "materialize-css"
import "./Login.css"
import {UserContext} from "../../App"
function Login() {
  const {state,dispatch}=useContext(UserContext)
  const navigate=useNavigate()
  const [email,setemail]=useState("")
  const [password,setpassword]=useState("")
  function PostData(e){
    e.preventDefault();
    axios.post("/signin",{email,password})
    .then(res=>{
      if(!res.data.error)
      {
        localStorage.setItem("jwt",res.data.token)
        localStorage.setItem("user",JSON.stringify(res.data.user))
        dispatch({type:"USER",payload:res.data.user})
         M.toast({html:"Successfully Signed In",classes:"#43a047 green darken-1"})
         navigate("/")
      }
      else
       M.toast({html:res.data.error,classes:"#c62828 red darken-3"})
    })
    .catch(err=>console.log(err))

  }
  return (
    <div className='login_card'>
         <div className='card auth_login_card'>
            <h3>ChatVibe</h3>
             <input  type="email" placeholder="E-Mail" value={email} onChange={(e)=>setemail(e.target.value)}/>
             <input  type="password" placeholder="Password" value={password} onChange={(e)=>setpassword(e.target.value)}/>
             <button className='btn waves-effect waves-light #64b5f6 blue darken-1' onClick={PostData}>Login</button>
            <br/> <Link to="/reset">forget password?</Link>
             <h6>Don't have an account?</h6>
             <Link to="/signup">Sign up</Link>
         </div>
    </div>
  )
}

export default Login