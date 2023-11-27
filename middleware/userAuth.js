const User = require("../models/userModel")
const isLogin = async(req,res,next)=>{
    try {
       if(req.session.user_id){}
       else{
           res.redirect('/');
       }
       next();
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async(req,res,next)=>{
    try {
      if(req.session.user_id){
         res.redirect('/home');
      }
      next();
    } catch (error) {
        console.log(error.message);
    }
}

const isBlocked = async (req, res, next) => {
  try {
    const userId = req.session.user_id;  
    const user = await User.findOne({ _id: userId }); 
    if (user?.is_blocked === true) {
      await res.cookie("session", "", { maxAge: 1 });
      return res.redirect("/login");
    } else {
      next();
    }
  } catch (error) {
    console.error("Error in isBlocked middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




module.exports = {
    isLogin,
    isLogout,
    isBlocked,

}