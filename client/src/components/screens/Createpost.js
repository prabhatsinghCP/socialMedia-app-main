import React, { useEffect, useState } from 'react'
import axios from "axios"
import "./Createpost.css"
import M from "materialize-css"
import {  useNavigate } from 'react-router-dom'
function Createpost() {
  const navigate=useNavigate()
 const [body,setBody]=useState("")
const [image,setImage]=useState(null)
const [url,setUrl]=useState("")
function handleImage(e){
  if(e.target.files[0])
  setImage(e.target.files[0])
}
useEffect(()=>{
  if(url){
    axios.post("/createpost",{body,photo:url},{
   headers:{
     "Authorization":localStorage.getItem("jwt")
   }
 })
  .then(res=>{
    if(res.data.error)
    M.toast({html:res.data.error,classes:"#c62828 red darken-3"})
   else{
    
    M.toast({html:"Successfully Posted",classes:"#43a047 green darken-1"})
   navigate("/")
   }
  })
  .catch(err=>console.log(err))
  }
},[url])
function PostDetails(){
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
  return (
    <div className='card create_post_div'>
        <input type="text" placeholder="caption" value={body} onChange={(e)=>setBody(e.target.value)}/>
        <div className="file-field input-field">
        <div className="btn #64b5f6 blue darken-1">
        <span>Upload Image</span>
        <input type="file" onChange={handleImage}/>
        </div>
        <div className="file-path-wrapper">
        <input className="file-path validate" type="text"/>
        </div>
    </div>
    <button onClick={PostDetails} className='btn waves-effect waves-light #64b5f6 blue darken-2'>Submit Post</button>
    </div>
  )
}

export default Createpost