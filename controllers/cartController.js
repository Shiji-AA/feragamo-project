const cartModel = require('../models/cartModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');

const loadAddtoCart = async (req, res) => {
  try {
    const product = await Product.find({});
 
    const userId = req.session.user._id;
    const userCart = await Cart.findOne({ user: userId }).populate('cart.productId');
    res.render('addTocart', { product: product, userCart: userCart });
  } catch (error) {
    res.status(500).send('Oops! Something went wrong.')
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.session?.user?._id;
    const productId = req.query?.productId;
    const product = await Product?.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    let userCart = await Cart.findOne({ user: userId }).populate('cart.productId');
    // For new User    
    if (!userCart) {
      userCart = new Cart({ user: userId, cart: [] }); // Assuming Cart model has 'user' and 'cart' fields
    }
    let existingCartItem;
    if(userCart){
       existingCartItem = userCart.cart.find((item) => item.productId.equals(productId));
    }else{
      console.error("Cart property is missing in userCart");
    }    

 if (existingCartItem) {
      existingCartItem.quantity += 1;
      existingCartItem.subtotal = existingCartItem.quantity * product.price;
    } else {
      userCart.cart.push({
        productId: productId,
        quantity: 1,
        subtotal: product.price,
      });
    }
    await userCart.save();
    res.redirect('/addTocart'); // Removed {product: product, userCart: userCart}
  } catch (error) {    
    res.status(500).send('Oops! Something went wrong.')
  }
};


// Delete cart Item
const deleteFromCart = async (req, res) => {
  try {
    const userId = req.session?.user._id;
    const cartId = req.query?.productId;
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found");
      // You may want to send an error response here or redirect to an error page.
      return res.status(404).send("User not found");
    }
    const userCart = await Cart.findOne({ user: userId });
    //console.log(userCart,"UU")
    if (!userCart) {
      console.log("Cart not found for this user");
      return res.status(404).send("Cart not found for this user");
    }
    const productCount = userCart.cart.length - 1
    //console.log(productCount,'count');
    const existingCartItemIndex = userCart.cart.findIndex(
      (item) => item._id.toString() === cartId
    );
    //console.log(existingCartItemIndex,'existing');
    if (existingCartItemIndex !== -1) {
      // Get the item to delete
      const deletedItem = userCart.cart[existingCartItemIndex];
      // console.log(deletedItem,"delete");
      const { productId, quantity, subtotal } = deletedItem;
      // Remove the item from the cart
      userCart.cart.splice(existingCartItemIndex, 1);
      await userCart.save();
      console.log(productId, quantity, subtotal);
      res.json({ status: true, message: 'product removed from cart', length: productCount })
    } else {
      console.log("Cart item not found");
    }
  }
  catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};



//Update quantity

const updateQuantity = async (req, res, next) => {
  const userId = req.session?.user._id;
  const cartItemId = req.body.cartItemId;
  try {
    const cart = await cartModel.findOne({ user: userId }).populate("cart.productId");
    const cartIndex = cart.cart.findIndex((item) => item.productId._id.equals(cartItemId));
    if (cartIndex === -1) {
      return res.json({ success: false, message: "Cart item not found." });
    }
    const cartItem = cart.cart[cartIndex];
    const newQuantity = cartItem.quantity + 1;
    if (newQuantity > cartItem.productId.stock) {
      return res.json({ success: false, message: "Sorry, no more stock available" });
    }
    cartItem.quantity = newQuantity;
    // Save the updated cart item
    await cart.save();

    const total = newQuantity * cartItem.productId.price;

    res.json({
      success: true,
      message: "Quantity updated successfully.",
      total: parseInt(total),
      quantity: newQuantity
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to update quantity." });
  }
};


const decrementQuantity = async (req, res, next) => {
  const userId = req.session?.user._id;
  const cartItemId = req.body.cartItemId;
  try {
    const cart = await cartModel.findOne({ user: userId }).populate("cart.productId");
    const cartIndex = cart.cart.findIndex((item) => item.productId._id.equals(cartItemId));
    console.log(cartIndex, "cartIndex");
    if (cartIndex === -1) {
      return res.json({ success: false, message: "Cart item not found." });
    }
    cart.cart[cartIndex].quantity -= 1;
    await cart.save();
    const total = cart.cart[cartIndex].quantity * cart.cart[cartIndex].productId.price;
    
    const quantity = cart.cart[cartIndex].quantity;
    //console.log(quantity, "kkkkk");
    res.json({
      success: true,
      message: "Quantity updated successfully.",
      total: parseInt(total),
      quantity
    });
  } catch (error) {
    res.json({ success: false, message: "Failed to update quantity." });
  }
};








module.exports = {
  loadAddtoCart,
  addToCart,
  updateQuantity,
  deleteFromCart,
  decrementQuantity,
  

}