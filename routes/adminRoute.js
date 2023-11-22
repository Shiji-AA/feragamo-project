const express=require("express");
const bodyParser=require("body-parser")
const path=require("path")

const admin_route=express()
const session=require("express-session")
admin_route.set("view engine","ejs");
admin_route.set("views","./views/admin")
const multer = require("../multer/multer");

const adminController=require("../controllers/adminController")
const categoryController=require("../controllers/categoryController")
const productController=require("../controllers/productController");
const bannerController= require("../controllers/bannerController")
const showAddProduct=require("../controllers/productController" )
const orderController= require("../controllers/orderController")


admin_route.use(express.static("public"))
//admin_route.use('/static', express.static(path.join(__dirname, 'public')))
//admin_route.use('/js', express.static(path.join(__dirname, 'public/admin-assets/js')))
admin_route.use('/styles', express.static(path.join(__dirname, 'public/admin-assets/css')))


const admin=require("../config/config")
const auth=require("../middleware/adminAuth")

admin_route.use(session({
    secret: admin.adminSession,
    resave: false,
    saveUninitialized: true,
}));



admin_route.get("/admin",auth.isLogout,adminController.loadAdminLogin);
admin_route.get("/admin/dashboard",auth.isLogin,adminController.loadDashboard);
admin_route.post("/admin",adminController.verifyAdmin);

//for categories
admin_route.get("/admin",auth.isLogout,categoryController.loadAdminCategories);
admin_route.get("/admin/dashboard/categories",auth.isLogin,categoryController.loadCategory);
admin_route.get("/admin/dashboard/categories/addCategory",auth.isLogin,categoryController.loadAddCategory);
admin_route.post("/admin/dashboard/categories/addCategory",auth.isLogin,categoryController.addCategory);
admin_route.get("/admin/dashboard/categories/edit",auth.isLogin, categoryController.editCategory);
admin_route.post("/admin/dashboard/categories/edit/:categoryId",auth.isLogin, categoryController.updateCategory);
admin_route.get('/unListCategory/:id',auth.isLogin,categoryController.unListCategory)
admin_route.get('/reListCategory/:catId',auth.isLogin,categoryController.reListCategory);

admin_route.get("/admin/logout",auth.isLogin,adminController.adminLogout)

//for users
admin_route.get('/admin/dashboard/users',auth.isLogin,adminController.loadUsers)
admin_route.get('/blockUser/:id',auth.isLogin,adminController.blockUser)
admin_route.get('/unBlockUser/:unblockid',auth.isLogin,adminController.unBlockUser)

//for Products
admin_route.get('/admin/dashboard/products',auth.isLogin,productController.loadProducts)
admin_route.get('/addProduct',auth.isLogin,productController.showAddProduct)
admin_route.post('/addProduct',multer.upload.array("image",4),productController.addProduct)
admin_route.get('/admin/dashboard/products/edit',auth.isLogin,productController.loadEditProduct)
admin_route.post('/admin/dashboard/products/edit/:productId',multer.upload.array("image",4),productController.updateProduct)

admin_route.get('/admin/unListProduct/:productId',auth.isLogin,productController.unListProduct)
admin_route.get('/admin/reListProduct/:protId',auth.isLogin,productController.reListProduct);

//for OrderManagement
admin_route.get('/admin/dashboard/orders',auth.isLogin,adminController.loadAdminOrders);
admin_route.get('/orders/edit/:id',auth.isLogin,adminController.loadEditOrders);
admin_route.post('/admin/updateOrder',auth.isLogin,adminController.updateOrder);
admin_route.post('/admin/approvereturn/:id',auth.isLogin, adminController.acceptRequest);
admin_route.post('/admin/rejectreturn/:id',auth.isLogin,adminController.rejectRequest);
admin_route.get('/admin/dashboard/ordersPagination',auth.isLogin,orderController.ordersPaginationAdmin);



//for CouponManagement
admin_route.get('/admin/dashboard/coupon',auth.isLogin,adminController.couponManagementPage);
admin_route.post('/addCoupon',auth.isLogin,adminController.addCoupon)
admin_route.get('/couponManagement/edit/:_id',auth.isLogin,adminController.editCouponPage);
admin_route.post('/updateCoupon',auth.isLogin,adminController.updateCoupon);
admin_route.get('/deleteCoupon/:_id',auth.isLogin,adminController.deleteCoupon);

//for offerManagement
admin_route.get('/admin/dashboard/offer',auth.isLogin,adminController.offerManagementPage);
admin_route.post('/addOffer',auth.isLogin,adminController.addOffer)
admin_route.get('/offerManagement/edit/:_id',auth.isLogin,adminController.editOfferPage);
admin_route.post('/updateOffer',auth.isLogin,adminController.updateOffer);
admin_route.get('/deleteOffer/:_id',auth.isLogin,adminController.deleteOffer);

//for AdminDashBoard
admin_route.post('/admin/fetchData/:time',auth.isLogin,adminController.fetchDataGraph)

//for salesReport
admin_route.get('/admin/dashboard/salesreport',auth.isLogin,adminController.loadSalesReport)
//admin_route.get('/admin/invoice',auth.isLogin,adminController.loadInvoiceSales);
admin_route.get('/dailyOrder',auth.isLogin,adminController.dailyOrder)
admin_route.get('/weeklyOrder',auth.isLogin,adminController.weeklyOrder)
admin_route.get('/yearlyOrder',auth.isLogin,adminController.yearlyOrder)
admin_route.post('/UpdateOrderByDateForm',auth.isLogin,adminController.UpdateOrderByDateForm)
admin_route.get('/invoiceSales',auth.isLogin,adminController.invoiceSales)

//Banner
admin_route.get('/admin/dashboard/banner',auth.isLogin,bannerController.loadBanner)
admin_route.get('/addBanner',auth.isLogin,bannerController.showAddBanner);
admin_route.post('/addBanner',multer.upload.array("image",4),bannerController.addBanner);
admin_route.get('/admin/dashboard/banner/edit',auth.isLogin,bannerController.loadEditBanner)
admin_route.post('/admin/dashboard/banner/edit/:bannerId',multer.upload.array("image",4),bannerController.updateBanner)
admin_route.get('/admin/unListBanner/:bannerId',auth.isLogin,bannerController.unListBanner)
admin_route.get('/admin/reListBanner/:bannerId',auth.isLogin,bannerController.reListBanner);
















module.exports=admin_route