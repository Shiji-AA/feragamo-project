const CategoryModel = require("../models/categoryModel");
const Product= require("../models/productModel")


//Load Categories

const loadAdminCategories = async (req, res) => {
  try {
    if (req.session.admin_id) {  //if user is authenticated
      return res.redirect('/admin/dashboard/categories'); // Redirect to the category page
    } else {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.render("adminLogin")
    }
  } catch (err) {
    console.log(err.message);
  }
}
const loadCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.find();//creating collection in db
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const userData = await CategoryModel.find({ is_admin: 0 })
    res.render("adminCategories", { users: userData, categories: categories })

  } catch (err) {
    console.log(err.message)
  }
}


//For Adding category

const loadAddCategory = async (req, res) => {
  try {
    res.render('addCategory')
  } catch (error) {
    console.log(error.message)
  }
}

const addCategory = async (req, res) => {
  try {
    const categoryName = req.body.name.toUpperCase();
    const existingCategory = await CategoryModel.findOne({ name: categoryName })
    if (existingCategory) {
      return res.render("addCategory", { message: "Category already exists" })
    }
    if (!req.body.name || req.body.name.trim().length === 0) {
      return res.render("addCategory", { message: "Name is required" });
    }
    const categories = new CategoryModel({
      name: req.body.name,
      discountPercentage: req.body.discountPercentage,
      validFrom:req.body.validFrom,
      validFrom:req.body.validTo,
      description: req.body.description
    })
    await categories.save()      // saving to database then show category page
    res.redirect('/admin/dashboard/categories')
  }
  catch (error) {
    console.log(error.message)
  }
}

const editCategory = async (req, res) => {
  try {

    const categoryData = await CategoryModel.findById(req.query.id);
    res.render('adminCategoryEdit', { categoryData: categoryData });

  } catch (error) {
    console.log(error.message);
  }
}
const updateCategory = async (req, res) => {
  try {
    const id = req.params.categoryId; // Get the category ID from the route parameter
    const updatedData = req.body; // Get the updated data from the request body
    const updatedCategory = await CategoryModel.findByIdAndUpdate(id, updatedData, { new: true });
    if (updatedCategory) {
      res.redirect(`/admin/dashboard/categories`);

    } else {
      res.redirect('/admin/dashboard/categories'); // Handle the case where the update fails
    }
  } catch (error) {
    console.error(error.message);
    res.redirect('/admin/dashboard/categories'); // Handle errors gracefully
  }
};


const unListCategory = async (req, res) => {
  try {
    const id = req.params.id
    // Use await to make sure CategoryModel.findById() resolves before continuing
    const category = await CategoryModel.findById(id);

    // Check if category exists
    if (!category) {
      console.log("category not found")
    }
    category.isActive = false;
    await category.save();

    res.redirect('/admin/dashboard/categories');
  } catch (error) {
    console.error(error.message);
  }
}

const reListCategory = async (req, res) => {
  try {
    const categoryId = req.params.catId;
    // Use await to make sure CategoryModel.findById() resolves before continuing
    const category = await CategoryModel.findById(categoryId);

    // Check if category exists
    if (!category) {
      console.log("category not found")
    }
    category.isActive = true;
    await category.save();

    res.redirect('/admin/dashboard/categories');
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = {
  loadAdminCategories,
  loadCategory,
  loadAddCategory,
  addCategory,
  editCategory,
  updateCategory,
  unListCategory,
  reListCategory

}
