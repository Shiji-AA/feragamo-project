const express= require("express")

const path=require("path")
const session=require("express-session")
const auth =require("../middleware/userAuth")
const user_route=express()
const userController   =require("../controllers/userController")


const profileController =require("../controllers/profileController");
const cartController    =require("../controllers/cartController")
const orderController   =require("../controllers/orderController");
const couponController  =require("../controllers/couponController");
const offerController   =require("../controllers/offerController");
const productController =require("../controllers/productController")


user_route.set("view engine","ejs");
user_route.set("views","./views/users")
user_route.use(express.static("public"))
user_route.use('/static', express.static(path.join(__dirname, 'public')))
user_route.use('/js', express.static(path.join(__dirname, 'public/assets/js')))
user_route.use('/styles', express.static(path.join(__dirname, 'public/assets/css')))
user_route.use(session({
    secret: 'abc123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24* 7 }
}));


//registration ,login

user_route.get("/",userController.loadHome);
user_route.get("/register",auth.isLogout,userController.loadRegister);
user_route.post("/register",userController.insertUser);
user_route.get("/login",auth.isLogout,userController.loadlogin);
user_route.post("/login",userController.verifyUser);
user_route.get("/logout",auth.isLogin,userController.userLogout);

//OTP
user_route.post("/send-otp",userController.sendOTP)
user_route.post("/verify-otp",userController.verifyOTP)

//forget password and reset Code starts
user_route.get("/forget",auth.isLogout,userController.loadForgotPasswordPage)
user_route.post('/forget',userController.forgetVerifyOtp)
user_route.post("/verifyOtp",userController.verifyOtp)
user_route.get("/reset",auth.isLogout,userController.loadResetPage)
user_route.post('/reset',userController.resetPassword)

//product detail
user_route.get("/home",auth.isBlocked,auth.isLogin,userController.loadHome1)
user_route.get("/men",auth.isBlocked,auth.isLogin,userController.loadMen)
user_route.get("/woman",auth.isBlocked,auth.isLogin,userController.loadWoman)
user_route.get("/CASUAL",auth.isBlocked,auth.isLogin,userController.loadCasual)
user_route.get("/FORMAL",auth.isBlocked,auth.isLogin,userController.loadFormal)
user_route.get("/SPORT",auth.isBlocked,auth.isLogin,userController.loadSport)
user_route.get('/product-detail',auth.isBlocked,auth.isLogin,userController.loadProductDetail);
user_route.post('/searchProduct',auth.isBlocked,auth.isLogin,userController.searchProduct);

//myProfile
 user_route.get('/myProfile',auth.isBlocked,auth.isLogin,profileController.loadmyProfile);
 user_route.get('/editProfile',auth.isBlocked,auth.isLogin,profileController.loadEditProfile);
 user_route.post('/editProfile',auth.isBlocked,auth.isLogin,profileController.editProfile);
 user_route.get('/viewOrderdetails',auth.isBlocked,auth.isLogin,profileController.viewOrderdetails);
 user_route.get('/orderListingUserside',auth.isBlocked,auth.isLogin,profileController.orderListingUserside);
 

//Address
user_route.post('/addaddress',auth.isBlocked,auth.isLogin,profileController.addAddress);
user_route.get('/editAddress',auth.isBlocked,auth.isLogin,profileController.loadEditAddress);
user_route.post('/editAddress',auth.isBlocked,auth.isLogin,profileController.editAddress);
user_route.get('/deleteAddress',auth.isBlocked,auth.isLogin,profileController.deleteAddress);
user_route.post('/instantAddAddress',auth.isBlocked,auth.isLogin,profileController.instantAddAddress);

//add to cart

user_route.get('/addTocart',auth.isBlocked,auth.isLogin, cartController.loadAddtoCart);
user_route.post('/addToCart',auth.isBlocked,auth.isLogin,cartController.addToCart);
user_route.get('/delete-product-cart',auth.isBlocked,auth.isLogin, cartController.deleteFromCart);
user_route.post('/updatecartquantity',auth.isBlocked,auth.isLogin,cartController.updateQuantity);
user_route.post('/decremetcartquantity',auth.isBlocked,auth.isLogin,cartController.decrementQuantity);


//CheckoutPage//Order
user_route.get('/checkout',auth.isBlocked,auth.isLogin,orderController.loadCheckOut);
user_route.post('/confirmOrder',auth.isBlocked,auth.isLogin, orderController.confirmOrder);
user_route.get('/loadEmptyCart',auth.isBlocked,auth.isLogin,orderController.loadEmptyCart);
user_route.get('/orderPlaced',auth.isBlocked,auth.isLogin,orderController.loadOrderPlaced);
user_route.get('/cancelOrder',auth.isBlocked,auth.isLogin,orderController.cancelOrder);
user_route.get('/orders/invoice',auth.isBlocked,auth.isLogin,orderController.loadInvoice);
user_route.get('/ordersPagination',auth.isBlocked,auth.isLogin,orderController.ordersPagination);

//RazorPay

user_route.get("/orderconfirmation",auth.isBlocked,auth.isLogin,orderController.loadConfirm) 
user_route.post("/verify-payment",auth.isBlocked,auth.isLogin,orderController.loadverify);

//ApplyCoupon
user_route.post("/applyCoupon",auth.isBlocked,auth.isLogin,couponController.applyCoupon);
user_route.get("/getAvailableCoupons",auth.isBlocked,auth.isLogin,couponController.getAvailableCoupons);


//ApplyOffer
user_route.post("/applyOffer",auth.isBlocked,auth.isLogin,offerController.applyOffer);

//requestReturnChange
  
user_route.post("/requestReturn/:id",auth.isBlocked,auth.isLogin,orderController.returnRequestChange);



module.exports= user_route;