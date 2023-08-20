import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import "./Profile.css"

import { Link } from 'react-router-dom'
function Profile() {
  const {state,dispatch}=useContext(UserContext)
  const [photos,setPhotos]=useState([])
  const [image,setImage]=useState("")
  
  useEffect(()=>{
    axios.get("/myposts",{
      headers:{
        "Authorization":localStorage.getItem("jwt")
      }
    })
    .then(res=>{
      return (
        setPhotos(res.data)

      )
    })
   
  },[])
  
  return (
    <div className='profile_page'>
    
    <div className='profile_header'>
        <div className='profile_image'>
          <img src={state?state?.pic:"Loading...."} alt='Profile' />
      
           
        </div>
        <div className='user_info'>
          <h4>{state?state?.name:"Loading"}</h4>
          <h5>{state?state?.email:"Loading"}</h5>

          <div>
  
            <h6>{photos.length} posts</h6>
            <h6>{state?.followers?state?.followers.length:"0"} <Link to={"/followerlist/"+state?._id}>followers</Link></h6>
            <h6>{state?.followings?state?.followings.length:"0"} <Link to={"/followinglist/"+state?._id}>followings</Link></h6>
          </div>
          <Link className='editprofile_link' to="/editprofile">Edit Profile</Link> 
        </div>
      </div>

      <div className='gallery'>
        {photos.map(photo=>{
          return(
            <img key={photo?._id} src={photo?.photo} alt="Post Photo"/>
          )
        })}
      </div>
    </div>
  )
}

export default Profile
