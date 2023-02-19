const mongoose=require("mongoose")



const postSchema=mongoose.Schema({
    title:String,
    description:String,
    time:String
})

const postModel=mongoose.model("post",postSchema)

module.exports={
    postModel
}