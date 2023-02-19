const express=require("express")
// const client=require("../config/connectredis")
const { authenticate } = require("../middlewares/authenticate.middleware")
const postRouter=express.Router()


postRouter.get("/",authenticate,async(req,res)=>{
    res.status(200).send("alltodos updated here soon")
})

module.exports={
    postRouter
}