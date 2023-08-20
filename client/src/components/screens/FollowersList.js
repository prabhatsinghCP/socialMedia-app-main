import { Avatar } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import "./FollowersList.css"
function FollowersList() {
    const {userid}=useParams()
 const [followers,setFollowers]=useState([])
useEffect(()=>{
    axios.get(`/getfollower/${userid}`)
    .then(res=>{

        setFollowers(res.data.followers)
    })
},[])

  return (
    <div className='follower_list'>
        <div className='card follow_card'>
            <h4>Followers List</h4>
         
        <ul>
        {followers.length!==0?followers.map(user=>{
              return <li key={user._id}> <Link className="collection_item" to={"/profile/"+user._id}><Avatar src={user.pic} className="avatar" alt={user.name}/>  {user.name}</Link></li>
          }):<h4 style={{color:"gray",fontSize:"1.4rem"}}>No followers</h4>}
        </ul>
        </div>
    </div>
  )
}

export default FollowersList