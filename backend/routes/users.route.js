const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const fs=require("fs")
const client=require('../config/connectredis')
const {userModel}=require("../models/user.model")


const userrouter=express.Router()

userrouter.post("/register",async(req,res)=>{
    var {name,email,age,password}=req.body
    let check=await userModel.findOne({email})
    if(check){
        res.status(200).send({"msg":"User already exist"})
    }else{
        try {
            bcrypt.hash(password,4,async(err,hash)=>{
                const user=new userModel({
                    name,
                    email,
                    age,
                    password:hash
                   })
                   await user.save()
                   res.status(200).send({"msg":"User Registered Successfully"})
            })
        } catch (error) {
            console.log(error)
            res.status(401).send({"msg":"BAD GATEWAY"})
        }
    }

})


userrouter.post("/login",async(req,res)=>{
    var {email,password}=req.body
    let check=await userModel.findOne({email})
    if(check){
        let hashpass=check.password
        bcrypt.compare(password,hashpass,async(err,result)=>{
            if(err){
                res.status(200).send({"msg":"Wrong credentials"})
            }else if(result){
                var main_token = jwt.sign({userID:check._id}, "mainredis",{expiresIn:"120s"});
                var refresh_token=jwt.sign({userID:check._id}, "refreshredis",{expiresIn:"300s"});
                let obj={}
                obj["main"]=main_token
                obj["refresh"]=refresh_token
                client.SETEX(email,300,JSON.stringify(obj), function(){
                    client.save(function(){
                     console.log('ok')
                    })
                   })
                res.status(200).send({"msg":"User Login Successfully",mainToken:main_token,refreshToken:refresh_token})
            }else{
                res.status(200).send({"msg":"Wrong credentials"})
            }
        })
    }else{
        res.status(200).send({"msg":"User not found"})
    }
})

userrouter.get("/logout",async(req,res)=>{
    var email=req.body.email
    var data=await client.get(email)
    if(!data){
        res.status(400).send({"msg":"alreday logged out"})
    }
    let allTOkens=(JSON.parse(data))
    let token=allTOkens.main
    const blacklisteddata=JSON.parse(fs.readFileSync("./blacklisteddata.json",'utf-8'))
    blacklisteddata.push(token)
    fs.writeFileSync("./blacklisteddata.json",JSON.stringify(blacklisteddata))
    res.status(200).send({"msg":"You are logged out succefully"})
})

module.exports={
    userrouter
}