const jwt=require("jsonwebtoken")
const  mongoose = require("mongoose")
const { JWT_SECRET } = require("../config/keys")
const User=mongoose.model("User")
module.exports=(req,res,next)=>{
  const {authorization}=req.headers
  if(!authorization){
      res.send({error:"You must be logged in"})
  }
  else{
      const token=authorization.replace("Bearer","")
      jwt.verify(token,JWT_SECRET,(err,payload)=>{
          if(err)
          res.send(err)
          else{
              const {_id}=payload
              User.findById(_id).then(userData=>{
                  req.user=userData
                  next()
              })          
            }
           
      })
  }
}