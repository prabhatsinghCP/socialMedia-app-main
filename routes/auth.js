const express=require("express")
const router=express.Router()
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const {JWT_SECRET} =require("../config/keys")
const requireLogin = require("../middleware/requireLogin")
router.use(bodyParser.urlencoded({extended:true}))
const User= mongoose.model("User")
// router.use(express.json())
router.use(express.json())

const {SENDGRID_API,EMAIL} =require("../config/keys")

const nodemailer=require("nodemailer")
const sendgridTransport=require("nodemailer-sendgrid-transport")
const crypto=require("crypto")

const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))



router.post("/signup",(req,res)=>{
    const {name,email,password,pic}=req.body
    if(!email||!password||!name){
        return res.send({error:"Please add all the fields"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(savedUser){
            return res.send("User already exists with that email")
        }
        else{
            bcrypt.hash(password,7)
            .then(hashed=>{
                const user=new User({
                    email,
                    password:hashed,
                    name,
                    pic:pic
                })
                user.save()
                .then(user=>{
                    transporter.sendMail({
                        to:user.email,
                        from :"krishanluhach04054@gmail.com",
                        subject:"Signup Successful",
                        html:"<h1>Welcome to the ChatVibe</h1><br><h3>Good Luck for your journey!!</h3>"
                    })
                    res.send({message:"Successfully saved"})
                })
                .catch(err=>{
                    console.log(err)
                })
            })
            .catch(err=>{console.log(err)})
            
        }
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post("/signin",(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
         res.send("Please Provide all fields")
    }
    else{
        User.findOne({email:email})
        .then(savedUser=>{
            if(!savedUser)
            return res.send({error:"Invalid Email or Password"})
            bcrypt.compare(password,savedUser.password)
            .then(isExist=>{
                if(isExist){
                //    res.send({message:"Successfully Signed In"})
                   const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                   const {_id,name,email,followers,followings,pic}=savedUser
                   res.send({token,user:{_id,email,name,pic,followers,followings}})
                }
              
                else
                res.send({error:"Invalid Email or password"})
            })
            .catch(err=>{console.log(err)})
        })
    }
})
router.post("/resetpassword",(req,res)=>{
   crypto.randomBytes(20,(err,buffer)=>{
       if(err){
           console.log(err)
       }
       else{
           const token=buffer.toString("hex")
           User.findOne({email:req.body.email})
           .then(user=>{
               if(!user)
               res.status(422).send("User not found with that email")
               else{
                   user.resetToken=token,
                   user.expireToken=Date.now()+3600000
                   user.save()
                   .then(result=>{
                       transporter.sendMail({
                           to:user.email,
                           from :"krishanluhach04054@gmail.com",
                           subject:"Password Reset",
                           html:`
                           <p>You requested for password reset</p>
                           <h4>Click on this <a href="${EMAIL}/reset/${token}">link</a> to reset password</h4>
                           `
                       })
                       res.send({message:"Check your E-Mail"})
                   })
               }
           })
       }
   })
})
router.post("/newpassword",(req,res)=>{
    const newPass=req.body.password
    const sentToken =req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
           return res.send({error:"Try again Session expired"})
        }
        bcrypt.hash(newPass,7).then(hashed=>{
            user.password=hashed
            user.resetToken=undefined
            user.expireToken=undefined
            user.save()
            .then(savedUser=>{
                res.send({message:"Password Updated Successfully"})
            })
        })
    })
    .catch(err=>console.log(err))
})
module.exports=router