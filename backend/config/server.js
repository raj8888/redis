const mongoose=require('mongoose')
mongoose.set("strictQuery",false)
const connection=mongoose.connect("mongodb+srv://raj:raj@cluster0.ikdub.mongodb.net/redisusers?retryWrites=true&w=majority")

module.exports=[
    connection
]