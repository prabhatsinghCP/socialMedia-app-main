import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import "./Home.css"
import M from "materialize-css"
import { Link } from 'react-router-dom'
function SubscribeUserPosts() {
  const {state,dispatch}=useContext(UserContext)
  const [data,setData]=useState([])
 useEffect(()=>{
   axios.get("/followposts",{
     headers:{
       "Authorization":localStorage.getItem("jwt")
     }
   })
   .then(res=>{
     return (
      setData(res.data)
     )
   })
 },[])
 function Like(id){

  axios.put("/like", {postId:id},{
    headers:{
      "Authorization":localStorage.getItem("jwt")
    }
  })
  .then(result=>{
    const newData=data.map(item=>{
      if(result.data._id===item._id)
      return result.data
      else 
      return item
    })
    setData(newData)
  })
  .catch(err=>console.log(err))
 }
 function Unlike(id){

  axios.put("/unlike", {postId:id},{
    headers:{
      "Authorization":localStorage.getItem("jwt")
    }
  })
  .then(result=>{
    const newData=data.map(item=>{
      if(result.data._id===item._id)
      return result.data
      else 
      return item
    })
    setData(newData)
  })
  .catch(err=>console.log(err))
 }
 function CommentPost(text,id){
   axios.put("/comment",{text:text,postId:id},{
     headers:{
       "Authorization":localStorage.getItem("jwt")
     }
   })
   .then(result=>{
     const newData=data.map(item=>{
       if(item._id===result.data._id)
       return result.data
       else
       return item
     })
     setData(newData)
   })
   .catch(err=>console.log(err))
 }
 function DeletePost(id){
   axios.delete("/deletepost/"+id,{
     headers:{
       "Authorization":localStorage.getItem("jwt")
     }
   })
   .then(result=>{
     
     const newData=data.filter(item=>item._id!==result.data._id)
     setData(newData)
     M.toast({html:"Successfully Deleted",classes:"#43a047 green darken-1"})
   })
   .catch(err=>console.log(err))
 }
 function DeleteComment(postId,commentId){
   axios.delete("/deletecomment/"+postId+"/"+commentId,{
     headers:{
       "Authorization":localStorage.getItem("jwt")
     }
   })
   .then(result=>{
   
     const newData=data.map(item=>{
       if(item._id===postId){
         item.comments=(item.comments.filter(record=>(record._id!==result.data._id)))
        
         }
         
       return item
     })

     setData(newData)
   })
   .catch(err=>console.log(err))
 }
  return (
    <div className='home'>
       
        {data.length!==0?data.map((item)=>{

          return (
            <div key={item._id} className='card home_card'>
            <h5 ><Link className='username_link' to={item.postedBy._id!==state._id?"/profile/"+item.postedBy._id:"/profile"}>{item.postedBy.name} </Link>
            {item.postedBy._id===state._id&&<i onClick={()=>DeletePost(item._id)} className='material-icons'>delete</i>}
            </h5>
            <div className='card-image'>
              <img src={item.photo} alt='nothing' />
            </div>
            <div className='card-content'>
            {item.likes.includes(state._id)?
            <>
            <i className='material-icons'  style={{color:"red",cursor:"pointer"}}>favorite</i>
            <i className='material-icons' onClick={()=>(Unlike(item._id))} style={{cursor:"pointer"}}>thumb_down</i>
            </>
              :
              <>
              <i className="material-icons"  style={{ color:"red",cursor:"pointer" }}>favorite_border</i>
              <i className="material-icons" onClick={()=>(Like(item._id))} style={{ cursor:"pointer" }}>thumb_up</i>
              </>
        }
                <h6>{item.likes.length} Likes</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {item.comments.map(record=>{
                  console.log(state._id,item.postedBy._id)
                  return (
                    <h6  key={record._id}>{(item.postedBy._id===state._id||record.postedBy._id===state._id)&&<i onClick={()=>{DeleteComment(item._id,record._id)}} className='material-icons'>clear</i>} <span><strong>{record.postedBy.name}</strong></span> {record.text}</h6>
                   
                  )
                })}
                
               <form className='comment_div' onSubmit={(e)=>{
                 e.preventDefault()
                CommentPost(e.target[0].value,item._id)
                e.target[0].value=""
               }} >
               <input type="text" placeholder="Add a comment" />
                <button className='material-icons' type='submit'>send</button>
               </form>
                
              
              </div>
              </div>
          )
        }):<h4 className='no_post'>No post Available</h4>}

    </div>
  )
}

export default SubscribeUserPosts