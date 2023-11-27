const path = require('path'); // Import the 'path' module if not already imported
const sharp = require('sharp'); 
const Product = require('../models/productModel');
const Banner = require('../models/bannerModel')




//Banner 

const loadBanner = async (req,res)=>{
    const banner = await Banner.find({})
    try{
        res.render('adminBanner',{banner:banner});
    }
    catch(error){
        res.status(500).send("Internal server error")
    }
  }
  const showAddBanner = async (req, res) => {
    try {
  res.render('addBanner')  
    } catch (error) {
      res.status(500).send('Oops! Something went wrong.');  
    }
  }  
  
  const addBanner = async (req, res) => {
    console.log(req.body, " bannerImages", req.files);    
    try {   
      const newBanner = new Banner({
        name: req.body.name,
        description: req.body.description,
        bannerImages: [],     
      });        
      for (let file of req.files) {
        const randomInteger = Math.floor(Math.random() * 20000001);
        const imageDirectory = "/public/productImages/";
        const imgFileName = "cropped" + randomInteger + ".jpg";
        const imagePath = path.join(__dirname, "../", imageDirectory, imgFileName);        
        // Process and save the uploaded image
        const croppedImage = await sharp(file.path)
          .resize(900, 400, { fit: "fill" })
          .toFile(imagePath);        
        if (croppedImage) {
          newBanner. bannerImages.push(imgFileName); // Add the filename to the images array
        }
      }      
      // Save the new banner with the updated images array
      await newBanner.save();      
      res.redirect('/admin/dashboard/banner');
    } catch (error) {      
      res.status(500).send("An error occurred while adding the banner.");
    }
  };
  
const loadEditBanner = async (req, res) => {
    try {
      const bannerId = req.query.id;
      const bannerData = await Banner.find({_id:bannerId})
      const banner = bannerData[0]; 
      res.render('editBanner',{banner:banner});
       } catch (error) {
      res.status(500).send("Something went wrong")
    }
  };

  const updateBanner = async (req, res) => {
    try {
      const id = req.params.bannerId;
      const updatedData = req.body;
      //console.log(updatedData)// Get the updated data from the request body
      const updatedBanner = await Banner.findByIdAndUpdate(id, updatedData, {new:true});
      if (updatedBanner) {
        res.redirect(`/admin/dashboard/banner`);
  
      } else {
        res.redirect('/admin/dashboard');
      }
  
      // const images = req.files.map(file => file.filename);
      // const updatedImages = images.length > 0 ? images : updatedData.images;
      // console.log(updatedImages);
      //  await Product.findByIdAndUpdate(req.body,updatedImages, { new: true });
    } catch (error) {
      res.status(500).send('Oops! Something went wrong.')
      res.redirect('/admin/dashboard/banner');
    }
  };


  const unListBanner = async (req, res) => {
    try {
      const bannerId = req.params.bannerId
      const banner = await Banner.findById(bannerId);
      // Check if product exists
      if (!banner) {
        console.log("Banner not found")
      }
      banner.isListed = false;
      await banner.save();  
      res.redirect('/admin/dashboard/banner');
    } catch (error) {
      res.status(500).send('Oops! Something went wrong.')
    }
  }

  const reListBanner = async (req, res) => {
    try {
  
      const bannerId = req.params.bannerId;
      const banner = await Banner.findById(bannerId); 
      if (!banner) {
        console.log("Banner not found")
      }
      banner.isListed = true;
      await banner.save();  
      res.redirect('/admin/dashboard/banner');
    } catch (error) {
    res.status(500).send('Oops! Something went wrong.')
    }
  }


  
  



module.exports={
    loadBanner,
    showAddBanner,
    addBanner,
    loadEditBanner,
    updateBanner,
    unListBanner,
    reListBanner,

}