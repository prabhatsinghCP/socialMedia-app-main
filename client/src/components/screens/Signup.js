import React, { useEffect, useState } from 'react'
import axios from "axios"
import M from "materialize-css"
import { Link, useNavigate} from 'react-router-dom'
import "./Signup.css"
function Signup() {
  const navigate=useNavigate()
  const [name,setname]=useState("")
  let [email,setemail]=useState("")
  const [password,setpassword]=useState("")
 const [image,setImage]=useState(null)
 const [url,setUrl]=useState(undefined)
useEffect(()=>{
   if(url)
   UploadFields()
},[url])

 function UploadFields(){
  axios.post("/signup",{name,email,password,pic:url})
  .then(response=>{
    if(response.data.error)
    M.toast({html:response.data.error,classes:"#c62828 red darken-3"})
    else{
      M.toast({html:response.data.message,classes:"#43a047 green darken-1"})
     navigate("/signin")
    }
  })
  .catch(err=>console.log(err));
 }
  function PostData(e){
    e.preventDefault();
    if(image){
      UploadPic()
  }
  else{
    UploadFields()
  }

 }
 function UploadPic(){
  const data=new FormData()
  data.append("file",image)
  data.append("upload_preset","chatVibe")
  data.append("cloud_name","drgqnxbwn")
  fetch("https://api.cloudinary.com/v1_1/drgqnxbwn/image/upload",{
    method:"post",
    body:data
  })
  .then(res=>res.json())
  .then(data=>{
    setUrl(data.url)
  })
  .catch(err=>console.log(err))
 }
 function handleImage(e){
  if(e.target.files[0])
  setImage(e.target.files[0])
}
  return (
    <div className='signup_card'>
    <div className='card auth_card'>
       <h3>ChatVibe</h3>
       <form onSubmit={PostData} >
       <div className='username_field'>
         <label>*</label>
         <input type="text" placeholder='UserName' value={name} onChange={(e)=>setname(e.target.value)}/>
       </div>
       <div className='username_field'>
       <label>*</label>
       <input  type="email" placeholder="E-Mail" value={email} onChange={(e)=>setemail(e.target.value)}/>
       </div>
       <div className='username_field'>
         <label>*</label>
         <input  type="password" placeholder="Password" value={password} onChange={(e)=>setpassword(e.target.value)}/>
       </div>
        <div className="file-field input-field">
        <h6 style={{width:"30%",color:"lightgray"}}>(optional)</h6>
        <div className="btn #64b5f6 blue darken-1">
        <span style={{fontWeight:"600"}}>Upload Profile Pic</span>
        <input type="file" onChange={handleImage}/>
        </div>
        <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
        
        </div>
       
    </div>
        <button  type="submit" className='btn waves-effect waves-light #64b5f6 blue darken-2' >Sign Up</button>
       </form>
        <h6>Already have an account?</h6>
        <Link to="/signin">Login</Link>
    </div>
</div>
  )
}

export default Signup