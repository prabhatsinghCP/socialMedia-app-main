const express=require("express")
const app=express()


const mongoose=require("mongoose")
const PORT=process.env.PORT||5000
const {MONGOURL}=require("./config/keys")





require("./models/post")
require("./models/user")
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))


    app.use(express.static("client/build"))
    const path=require("path")
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"client","build","index.html"))
    })


mongoose.connect(MONGOURL)
mongoose.connection.on("connected",()=>{
    app.listen(PORT,()=>{
        console.log('server is running on port '+PORT)
    })
    console.log("Connected to mongo")
})
mongoose.connection.on("error",(err)=>{
    console.log(err)
})
