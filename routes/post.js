const express=require("express")
const router=express.Router()
const mongoose=require("mongoose")
const bodyParser=require("body-parser")
const requireLogin = require("../middleware/requireLogin")

router.use(bodyParser.urlencoded({extended:true}))
const Post=mongoose.model("Post")

router.get("/allpost",requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name pic")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(post=>res.send(post))
    .catch(err=>console.log(err))
})
router.get("/followposts",requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.followings}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(post=>res.send(post))
    .catch(err=>console.log(err))
})
router.get("/myposts",requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .sort("-createdAt")
    .then(post=>res.send(post))
    .catch(err=>console.log(err))
})
router.post("/createpost",requireLogin,(req,res)=>{
    const {body,photo}=req.body
    if(!body||!photo)
      res.send({error:"Please fill all the fields"})
    else{
        req.user.password=undefined
     const post=new Post({

         body,
         photo,
         postedBy:req.user
     })
     post.save()
     .then(result=>{
         res.send(result)
     })
     .catch(err=>console.log(err))
    }
})
router.put("/like",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{new:true})
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err)
        res.send({error:err})
        else
        res.send(result)
})

})
router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{new:true})
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err)
        res.send({error:err})
        else
        res.send(result)
})

})
router.put("/comment",requireLogin,(req,res)=>{
    const comment={
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{new:true})
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err)
        res.send({error:err})
        else
        res.send(result)
})

})
router.delete("/deletepost/:postId",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err||!post)
        res.status(422).send({error:err})
        else{
            if(post.postedBy._id.toString()===req.user._id.toString()){
            
                post.remove()
                .then(result=>{
                    res.send(result)

                })
                .catch(err=>console.log(err))
            }
        }
    })
})
router.delete("/deletecomment/:postId/:commentId",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err||!post){
         res.status(422).send({error:err})
        }
         else{
             const commentedUser=post.comments.map(item=>{
               if(item._id.toString()===req.params.commentId.toString())
               return item.postedBy._id
             })
             if(post.postedBy._id.toString()===req.user._id.toString()||req.user._id.toString()===commentedUser.toString()){
              post.comments.map(item=>{
                  if(item._id.toString()===req.params.commentId.toString())
                  {
                       item.remove((err,result)=>{
                          if(!err)
                          res.send(result)
                          else
                          console.log(err)
                      })
                    
                  }
              })
              post.save()
             }
        }
    })
})
module.exports=router