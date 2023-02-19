const express=require('express')
const {connection}=require('./config/server')
const {userrouter}=require("./routes/users.route")
const {postRouter}=require("./routes/post.route")
const app=express()
app.use(express.json())
app.use("/user",userrouter)
app.use("/post",postRouter)

app.get("/",async(req,res)=>{
    res.send("HOME")
})

app.listen(4500,async()=>{
    try {
        await connection
        console.log("connected to DB")
    } catch (error) {
        console.log(error)
    }
    console.log("listning on port 4500")
})