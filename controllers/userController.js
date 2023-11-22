const User = require("../models/userModel")
const CategoryModel = require("../models/categoryModel")
const Product = require('../models/productModel')
const Banner = require('../models/bannerModel')
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt");




const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (err) {
        console.log(err.message)
    }
}

const loadHome = async (req, res) => {
    try {
        const categories = await CategoryModel.find({ isActive: true });
        const product = await Product.find({ isListed: true });
        const banner = await Banner.find({ isListed:true});
        res.render("index",{category:categories,product:product,banner:banner})
    } catch (err) {
        console.log(err.message);
    }
}

const loadHome1 = async (req, res) => {
    try {
        const categories = await CategoryModel.find({ isActive: true })
        const product = await Product.find({ isListed: true })    
        res.render("Home1", { category: categories, product: product })
    } catch (err) {
        console.log(err.message);
    }
}
const loadMen = async (req, res) => {
    try {
        const categories = await CategoryModel.find({})
        const product = await Product.find({ gender: 'male' })
        res.render("men", { category: categories, product: product })
    } catch (err) {
        console.log(err.message);
    }
}
const loadWoman = async (req, res) => {
    try {
        const categories = await CategoryModel.find({})
        const product = await Product.find({ gender: 'female' })
        res.render("woman", { category: categories, product: product })
    } catch (err) {
        console.log(err.message);
    }
}
const loadCasual = async (req, res) => {
    try {
        const categories = await CategoryModel.find({})
        const product = await Product.find({ category: "CASUAL" })
        res.render("casual", { category: categories, product: product })
    } catch (err) {
        console.log(err.message);
    }
}
const loadFormal = async (req, res) => {
    try {
        const categories = await CategoryModel.find({})
        const product = await Product.find({ category: "FORMAL" })
        res.render("formal", { category: categories, product: product })
    } catch (err) {
        console.log(err.message);
    }
}
const loadSport = async (req, res) => {
    try {
        const categories = await CategoryModel.find({})
        const product = await Product.find({ category: "SPORT" })
        res.render("sport", { category: categories, product: product })
    } catch (err) {
        console.log(err.message);
    }
}

const loadRegister = async (req, res) => {
    try {
        res.render("registration")
    } catch (err) {
        console.log(err.message);
    }
}

const insertUser = async (req, res) => {
    try {
        const checkEmail = await User.findOne({ email: req.body.email }); //this works after submit button
        if (checkEmail) {
            res.render("registration", { message: "Email already exists. Try again" });
        } else {
            const sPassword = await securePassword(req.body.password)
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mno,
                password: sPassword,
                is_blocked: false,
                is_admin: 0
            })
            const userData = await user.save()
            if (userData) {
                res.redirect("/login")
            } else {
                res.render("registration", { message: "failed" });
            }
        }
    }
    catch (error) {
        console.log(error.message);
    }
}


// =========================OTP Starts====================================
var otpCode;
const sendOTP = async (req, res) => {
    try {
        const email = req.body.email;
        otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: "shijihcl@gmail.com",
                pass: "tsqb ondk qqqb zgia"
            }
        });

        const mailOptions = {
            from: "shijihcl@gmail.com",
            to: email,
            subject: "Verification Code",
            text: `Your OTP code is: ${otpCode}`
        };

        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.error("Error sending email: ", err);
                return otpCode
            } else {
                console.log("Email sent: " + info.response);
            }
        });

    } catch (error) {
        console.error("Error: ", error);
        return res.status(500).json({ message: "Failed to send OTP email" });
    }
};


var verified;
const verifyOTP = async (req, res) => {
    verified = false;
    try {
        const enteredOTP = req.body.otp;
        if (enteredOTP == otpCode) {
            verified = true;
            res.send("Success")

        } else {
            return false;
        }
    } catch (error) {
        console.log(error.message);
    }
}
// =====================OTP Ends=========================================
const loadlogin = async (req, res) => {
    try {
        if (req.session.user) {      // If session exists already
            return res.redirect('/home');
        } else {
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
            res.render("login");
        }
    } catch (err) {
        console.log(err.message);
    }
}


const verifyUser = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });
        req.session.user = userData
        //console.log(userData)
        if (userData) {
            if (userData.is_admin === 0) {
                if (userData.is_blocked === false) {
                    const passwordMatch = await bcrypt.compare(password, userData.password);
                    if (passwordMatch) {
                        res.setHeader('cache-control', 'no-cache,no-store,must-revalidate');
                        req.session.user_id = userData._id;
                        return res.redirect("/home");
                    } else {
                        return res.render("login", { message: "Invalid Credentials!" });
                    }
                } else {
                    // User is blocked, show a message
                    return res.render("login", { message: "User is blocked." });
                }
            } else {
                return res.render("login", { message: "Invalid Credentials!" });
            }
        } else {
            return res.render("login", { message: "Invalid Credentials!" });
        }
    } catch (err) {
        console.error(err.message);

    }
}


// ===================================Forgot password===========================
const loadForgotPasswordPage = async (req, res) => {
    try {
        res.render("forgotPassword")
    }
    catch (error) {
        console.log(error.message)
    }
}

// ---------


let forgotMail;
const forgetVerifyOtp = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email })
        if (user) {
            forgotMail = email
            otpCode = Math.floor(1000 + Math.random() * 9000).toString();
            let forgotOtp = otpCode;

            console.log("forgotOtp is", forgotOtp)


            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: "shijihcl@gmail.com",
                    pass: "tsqb ondk qqqb zgia"
                }
            });
            const mailOptions1 = {
                from: "shijihcl@gmail.com",
                to: email,
                subject: "Reset Password",
                text: `Your OTP code for password reset is: ${forgotOtp}`
            };
            transporter.sendMail(mailOptions1, function (err, info) {
                if (err) {
                    console.error("Error sending email: ", err);
                    return otpCode
                } else {
                    console.log("Email sent: " + info.response);


                }
            });
        } else {
            res.render("forgotPassword", { message: "You are not a User.Create New Account!" })
        }

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ message: "Failed to send OTP email" });
    }
}


// ==========password reset====

const loadResetPage = async (req, res) => {
    try {
        res.render("resetPassword")
    }
    catch (error) {
        console.log(error)
    }

}


const verifyOtp = async (req, res) => {
    try {

        let forgotOtp = otpCode;
        const enteredOTP = req.body.otp;

        if (forgotOtp == enteredOTP) {

            res.redirect("/reset");

        } else {
            console.log("unable to load reset page")
        }
    }
    catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async (req, res) => {
    try {
        if (req.body.password === req.body.confirmPassword) {
            const sPassword = await securePassword(req.body.password)
            const forget = await User.updateOne({ email: forgotMail }, { $set: { password: sPassword } })
            res.redirect("/login")
        } else {
            res.render("resetPassword", { message: "Password mismatching" })
        }

    }
    catch (error) {
        console.log(error.message)

    }

}




// -------------------------------------------------------------------

const loadProductDetail = async (req, res) => {
    try {
        const categories = await CategoryModel.find({})
        const id = req.query.id;
        const product = await Product.find({ _id: id }); //find the id in database which is same as req.query.id ,then store in ProductData 

        res.render('product-detail', { product: product, category: categories });
    }
    catch (error) {
        console.error(error.message);
    }

}

const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect("/")
    } catch (error) {
        console.log(error.message)
    }
}
const searchProduct = async (req, res) => {
    try {
      const searchCriteria = req.body.searchCriteria;
      const category = await CategoryModel.find({ isActive: true })
    
      const product = await Product.find({
        $and: [
          { name: { $regex: new RegExp('^' + searchCriteria, 'i') } }, // Starts with searchCriteria (case-insensitive)
            ]
      });
  
      res.render('home1', { product,category }); // Assuming 'home1' is your view and passing the found products
  
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }
  }

module.exports = {
    loadHome,
    loadHome1,
    loadMen,
    loadWoman,
    loadCasual,
    loadFormal,
    loadSport,
    loadRegister,
    sendOTP,
    verifyOTP,
    insertUser,
    loadlogin,
    verifyUser,
    loadForgotPasswordPage,
    forgetVerifyOtp,
    loadResetPage,
    resetPassword,
    loadProductDetail,
    userLogout,
    verifyOtp,
    searchProduct,
   
}
