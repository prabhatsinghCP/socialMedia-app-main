import { Avatar } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import "./FollowersList.css"
function FollowingList() {
    const {userid}=useParams()
 const [followings,setFollowings]=useState([])
useEffect(()=>{
    axios.get(`/getfollower/${userid}`)
    .then(res=>{
        setFollowings(res.data.followings)
    })
},[])

  return (
    <div className='follower_list'>
        <div className='card follow_card'>
            <h4>Followings List</h4>
         
        <ul>
        {followings.length!==0?followings.map(user=>{
              return <li key={user._id}> <Link className="collection_item" to={"/profile/"+user._id}><Avatar src={user.pic} className="avatar" alt={user.name}/>  {user.name}</Link></li>
          }):<h4>No followings</h4>}
        </ul>
        </div>
    </div>
  )
}

export default FollowingList