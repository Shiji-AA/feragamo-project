
const mongoose=require("mongoose");
//const connectDB= mongoose.connect('mongodb://127.0.0.1:27017/feraGamo')
const connectDB= mongoose.connect('mongodb+srv://shijihcl:BxwrsjkQGzDZSdD9@feragamo-db.izd7duy.mongodb.net/FeraGamo?retryWrites=true&w=majority')
.then(()=>{
console.log("Server is running");
})
.catch((err)=>{
console.log(err);
})

module.exports=connectDB

// =============================

const userSession="thisisuser"
const adminSession="thisisadmin"

module.exports={
    userSession,
    adminSession
}