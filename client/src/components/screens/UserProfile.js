import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { UserContext } from '../../App'
import "./Profile.css"
function Profile() {
    const {userid}=useParams()
  const {state,dispatch}=useContext(UserContext)
  const [userProfile,setProfile]=useState(null)
  const [follow,setfollow]=useState(state?.followings.includes(userid)?false:true)
  useEffect(()=>{
    axios.get(`/user/${userid}`,{
      headers:{
        "Authorization":localStorage.getItem("jwt")
      }
    })
    .then(res=>{
    
      return (
        setProfile(res.data)
      )
    })
  },[])
  function FollowUser(){
    axios.put("/follow",{followId:userid},{
      headers:{
        "Authorization":localStorage.getItem("jwt")
      }
    })
    .then(result=>{
      dispatch({type:"UPDATE",payload:{followers:result.data.result2.followers,followings:result.data.result2.followings}})
      localStorage.setItem("user",JSON.stringify(result.data.result2))
      setProfile(prev=>{
        return {
         ...prev,
         user:{
           ...prev.user,
           followers:result.data.result1.followers,
           followings:result.data.result1.followings
         }
      }
      })
      setfollow(false)
    })
  }
  function UnfollowUser(){
    axios.put("/unfollow",{unfollowId:userid},{
      headers:{
        "Authorization":localStorage.getItem("jwt")
      }
    })
    .then(result=>{
      dispatch({type:"UPDATE",payload:{followers:result.data.result2.followers,followings:result.data.result2.followings}})
      localStorage.setItem("user",JSON.stringify(result.data.result2))
      setProfile(prev=>{
        return {
         ...prev,
         user:{
           ...prev.user,
           followers:result.data.result1.followers,
           followings:result.data.result1.followings
         }
      }
      })
      setfollow(true)
    })
  }
  return (
    <div className='profile_page'>
      {userProfile?
      
        <>
        <div className='profile_header'>
        <div className='profile_image'>
          <img src={userProfile.user.pic} alt='Profile' />
        </div>
        <div className='user_info'>
          <h4>{userProfile.user.name}</h4>
          <h5>{userProfile.user.email}</h5>
          <div>
            <h6>{userProfile.post.length} posts</h6>
            <h6>{userProfile.user.followers.length} <Link to={"/followerlist/"+userProfile.user._id}>followers</Link></h6>
            <h6>{userProfile.user.followings.length} <Link to={"/followinglist/"+userProfile.user._id}>followings</Link></h6>
          </div>
          {follow? <button className='btn waves-effect waves-light #64b5f6 blue darken-1' onClick={FollowUser}>Follow</button>

               :
               <button className='btn waves-effect waves-light #64b5f6 blue darken-1' onClick={UnfollowUser}>Unfollow</button>

               }
          
         
        </div>
      </div>
      <div className='gallery'>
        {userProfile.post.map(item=>{
          return(
            <img key={item._id} src={item.photo} alt="Post Photo"/>
          )
        })}
      </div>
        </>
      
      :<h2>Loading.....</h2>}
    </div>
  )
}

export default Profile