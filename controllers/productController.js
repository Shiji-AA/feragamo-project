const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const path = require('path');
const multer = require('multer');
const { log } = require('console');
const sharp = require("sharp");


const loadProducts = async (req, res) => {
  try {
    const product = await Product.find({})
    res.render('displayProduct', { product: product })

  } catch (error) {
    res.status(500).send('Oops! Something went wrong.')

  }
}
//for adding new productsPage

const showAddProduct = async (req, res) => {
  try {

    const categories = await Category.find({})
    res.render('addProduct', { category: categories })

  } catch (error) {
    res.status(500).send('Oops! Something went wrong.')

  }
}

   const addProduct = async (req, res) => {
   console.log(req.body, "images", req.files)
   try {
    const categories = await Category.find({})
    if (!req.body.name || req.body.name.trim().length === 0) {
      return res.render("addProduct", { message: "Name is required", category: categories });
    }
    if (!req.body.description || req.body.description.trim().length === 0) {
      return res.render("addProduct", { message: "brand is required", category: categories });
    }    
    if (req.body.price <= 0) {
      return res.render("addProduct", { message: "Product Price Should be greater than 0", category: categories });
    }
    if (req.body.stock < 0 || req.body.stock.trim().length === 0) {
      return res.render("addProduct", { message: "Stock  Should be greater than 0", category: categories });
    }
    const newProduct = new Product({
      name: req.body.name,
      description: req.body.description,
      gender: req.body.gender,
      images:[],
      category: req.body.category,
      stock: req.body.stock,
      price: req.body.price
    });  
for (let file of req.files) {
      const randomInteger = Math.floor(Math.random() * 20000001)
      const imageDirectory = "/public/productImages/"      
      let imgFileName = "cropped" + randomInteger + ".jpg";    
      let imagePath = path.join(__dirname, "../", imageDirectory, imgFileName);  
      const croppedImage = await sharp(file.path)
          .resize(300, 300, {
              fit: "fill",
          })
          .toFile(imagePath)
      if (croppedImage) {
          newProduct.images.push(imgFileName)
      }}
    await newProduct.save()
    res.redirect('/admin/dashboard/products');
  } catch (error) {
    res.status(500).send("An error occurred while adding the product.");
  }
}


const loadEditProduct = async (req, res) => {
  try {
    const categories = await Category.find({})
    const id = req.query.id
    const productData = await Product.find({ _id: id }); 
    const product = productData[0];
    res.render('adminEditProduct', { product: product, category: categories });
  } catch (error) {
    res.status(500).send('Oops! Something went wrong.')
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    // Get the product ID from the route parameter
    const updatedData = req.body;
    //console.log(updatedData)// Get the updated data from the request body
    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (updatedProduct) {
      res.redirect(`/admin/dashboard/products`);

    } else {
      res.redirect('/admin/dashboard/products');
    }

    // const images = req.files.map(file => file.filename);
    // const updatedImages = images.length > 0 ? images : updatedData.images;
    // console.log(updatedImages);
    //  await Product.findByIdAndUpdate(req.body,updatedImages, { new: true });
  } catch (error) {
    
    res.redirect('/admin/dashboard/products');
  }
};

const unListProduct = async (req, res) => {
  try {
    const productId = req.params.productId
    const product = await Product.findById(productId);
    // Check if product exists
    if (!product) {
      console.log("Product not found")
    }
    product.isListed = false;
    await product.save();

    res.redirect('/admin/dashboard/products');
  } catch (error) {
    res.status(500).send('Oops! Something went wrong.')
  }
}

const reListProduct = async (req, res) => {
  try {

    const productId = req.params.protId;

    const product = await Product.findById(productId);
    //console.log(product);

    if (!product) {
      console.log("Product not found")
    }
    product.isListed = true;
    await product.save();

    res.redirect('/admin/dashboard/products');
  } catch (error) {
    res.status(500).send('Oops! Something went wrong.')
  }
}




module.exports = {
  loadProducts,
  addProduct,
  showAddProduct,
  loadEditProduct,
  updateProduct,
  unListProduct,
  reListProduct,
 

}