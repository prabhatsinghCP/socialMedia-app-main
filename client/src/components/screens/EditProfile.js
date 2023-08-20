import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App';
import M from "materialize-css"
import "./EditProfile.css"
import { useNavigate } from 'react-router-dom';
function EditProfile() {
    const navigate=useNavigate()
    const {state,dispatch}=useContext(UserContext)
    const [name,setName]=useState(state?.name?state.name:"")
    const [email,setEmail]=useState(state?.email?state.email:"")
    const [image,setImage]=useState("")


    useEffect(()=>{
        if(image){
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
          //setUrl(data.url)
          // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
          // dispatch({type:"UPDATEPIC",payload:data.url})
          axios.put("/updatepic",{pic:data.url},{
            headers:{
              "Authorization":localStorage.getItem("jwt")
            }
          })
          .then(result=>{
            
            
                localStorage.setItem("user",JSON.stringify({...state,pic:result.data.pic}))
                dispatch({type:"UPDATEPIC",payload:result.data.pic})
                M.toast({html:"Successfully Updated Profile Pic",classes:"#43a047 green darken-1"})
    
            

          
          })
        
    
        })
        .catch(err=>{
          if(err)
          console.log(err)
    })
        }
    },[image])
      function UploadPic(file){
        setImage(file)
        
      }
 function UpdateDetails(){
    
      axios.put("/updateinfo",{name,email,prevMail:state.email},{
        headers:{
            "Authorization":localStorage.getItem("jwt")
        }
    })
    .then(result=>{
        //console.log(result.data)
        if(result.data.message)
        M.toast({html:result.data.message,classes:"#c62828 red darken-3"})
        else{
           localStorage.setItem("user",JSON.stringify({...state,name:result.data.name,email:result.data.email}))
           dispatch({type:"UPDATEINFO",payload:{name:result.data.name,email:result.data.email}})
           M.toast({html:"Successfully Updated Profile",classes:"#43a047 green darken-1"})
           navigate("/profile")
        }
       

    })
    .catch(err=>console.log(err))
    
 }  
 function DeleteUser(){
   axios.delete("/deleteuser/"+state._id)
   .then(res=>{
     M.toast({html:"Successfully Deleted Account",classes:"#43a047 green darken-1"})
     
    localStorage.clear()
    dispatch({type:"CLEAR"})
    navigate("/signin")
   })
 }   
  return (
    <div className='editprofile_card'>
    <div className='card edit_card'>
       <button onClick={DeleteUser} className='deleteaccount'>Delete Account</button>
       <img src={state?.pic?state.pic:"Loading.."} alt="Profile"/>
       <div className="file-field input-field">
         <div className=" pic_button btn #64b5f6 blue darken-1">
         <span style={{fontWeight:"600"}}>Update Profile Pic</span>
         <input type="file" onChange={(e)=>{UploadPic(e.target.files[0])}} />
         </div>
       {/* <div className="file-path-wrapper">
       <input className="file-path validate" type="text"/>

       </div> */}

</div>     
       <div>
       <h6>Name</h6>
       <input type="text" onChange={(e)=>setName(e.target.value)} placeholder='User name' value={name}/>
       </div>
      <div>
      <h6>Email</h6>
       <input type="text"  onChange={e=>setEmail(e.target.value)} placeholder='Email' value={email}/>
      </div>
      <button onClick={UpdateDetails} className=' save_button btn waves-effect waves-light #64b5f6 blue darken-1'>Save Changes</button>

    </div>
</div>
  )
}

export default EditProfile