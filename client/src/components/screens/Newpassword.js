import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import M from "materialize-css"
import "./Login.css"
function Newpassword() {
    const {token} =useParams()
  const navigate=useNavigate()
  const [password,setpassword]=useState("")
  function PostData(e){
    e.preventDefault();
    axios.post("/newpassword",{password,token})
    .then(res=>{
      if(!res.data.error)
      {
        
         M.toast({html:res.data.message,classes:"#43a047 green darken-1"})
         navigate("/signin")
      }
      else
       M.toast({html:res.data.error,classes:"#c62828 red darken-3"})
    })
    .catch(err=>console.log(err))

  }
  return (
    <div className='login_card'>
         <div className='card auth_card'>
            <h3>ChatVibe</h3>
             <input  type="password" placeholder="Enter New Password" value={password} onChange={(e)=>setpassword(e.target.value)}/>
             <button className='btn waves-effect waves-light #64b5f6 blue darken-1' onClick={PostData}>Update Password</button>
             
         </div>
    </div>
  )
}

export default Newpassword