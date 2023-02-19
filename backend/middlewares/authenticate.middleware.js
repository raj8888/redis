var jwt=require("jsonwebtoken")
const fs=require("fs")
const client=require("../config/connectredis")

const authenticate=async(req,res,next)=>{
    // var token=req.headers.authorization?.split(" ")[1];
    var email=req.body.email
    var data=await client.get(email)
    if(data==false){
        res.status(200).send({"msg":"Login again"})
    }
    let allTOkens=(JSON.parse(data))
    if(allTOkens==null || allTOkens==false){
        res.status(200).send({"msg":"Login again"})
    }else{
        let token=allTOkens.main
    const blacklisteddata = JSON.parse(fs.readFileSync("./blacklisteddata.json", "utf-8"))

    if(blacklisteddata.includes(token)){
        res.status(400).send({"msg":"Login again"})
    }else{
        jwt.verify(token, "mainredis", function(err, decoded) {
            if(err){
                res.send({"message" : "plz login err first"})
            }
            else if(decoded){
                const userID=decoded.userID
                req.body.userID=userID
                next()
            }else{
                res.send({"message" : "plz login else first"})
            }
      });
    
    }
    }

    
    
    
    
}

module.exports={
    authenticate
}