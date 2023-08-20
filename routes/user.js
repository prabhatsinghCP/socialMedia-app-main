const express=require("express")
const router=express.Router()
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const requireLogin = require("../middleware/requireLogin")
const Post=mongoose.model("Post")
const User=mongoose.model("User")
router.use(bodyParser.urlencoded({extended:true}))
router.get("/user/:id",requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,post)=>{
            if(err)
            return res.send({error:err})
            else
           return  res.send({user,post})
        })
    })
    .catch(err=>{
        return res.status(404).send({error:"User Not Found"})
    })
})
router.put("/follow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{new:true},(err,result1)=>{
        if(err)
        return res.status(422).send({error:err})
        else{
         User.findByIdAndUpdate(req.user._id,{
             $push:{followings:req.body.followId}
         },{new:true})
         .select("-password")
         .populate("followers followings","_id name pic email")
         .then(result2=>res.send({result1,result2}))
         .catch(err=>console.log(err))
        }
    })
})
router.put("/unfollow",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{new:true},(err,result1)=>{
        if(err)
        return res.status(422).send({error:err})
        else{
         User.findByIdAndUpdate(req.user._id,{
             $pull:{followings:req.body.unfollowId}
         },{new:true})
         .select("-password")
         .populate("followers followings","_id name pic email")
         .then(result2=>res.send({result1,result2}))
         .catch(err=>console.log(err))
        }
    })
})
router.put("/updatepic",requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
            if(err)
            return res.status(422).send({error:"Pic Cannot Posted"})
            else
            return res.send(result)
        }
        )
})
router.put("/updateinfo",requireLogin,(req,res)=>{
User.findOne({email:req.body.email})
.then(result=>{
    if(result&&req.body.prevMail!==req.body.email)
    return res.send({message:"Email already Exists"})
    else{
    
        User.findByIdAndUpdate(req.user._id,{$set:{name:req.body.name,email:req.body.email}},{new:true},
            (err,result)=>{
                if(err)
                return res.status(422).send({error:"Info Cannot Changed"})
                else
                return res.send(result)
            }
            )

    }
})

})
router.post("/searchuser",(req,res)=>{
    let userPattern=new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email name pic")
    .then(user=>{
        res.send({user})
    })
    .catch(err=>console.log(err))
})
router.delete("/deleteuser/:userId",(req,res)=>{
    User.findByIdAndDelete(req.params.userId)
    .then(result=>{
        User.updateMany({followers:{$in:req.params.userId}},{$pull:{followers:req.params.userId}})
        .then(res=>console.log(res))
        res.send(result)
    })
    .catch(err=>console.log(err))
})
 router.get("/getfollower/:userid",(req,res)=>{
     User.findById(req.params.userid)
    .populate("followers followings","_id name email pic")
    .then(result=>res.send(result))
    .catch(err=>console.log(err))
 })
module.exports =router