
const User = require("../models/userModel")
const Address = require("../models/AddressModel")
const Order = require("../models/orderModel")


const loadmyProfile = async (req, res) => {
  try {
    const id = req.session.user._id;
    const user = await User.findOne({ _id: id })
    const addresses = await Address.find({ user: id })
    const orders = await Order.find({ customerId: id })
    res.render('myProfile', { user, addresses, orders })
  } catch (error) {
    console.log(error.message);
  }
}

const orderListingUserside = async (req, res) => {
  try {
    const id = req.session.user._id;
    const user = await User.findOne({ _id: id })
    const addresses = await Address.find({ user: id })
    const orders = await Order.find({ customerId: id })
    res.render('orderListingUserside', { user, addresses, orders })
  } catch (error) {
    console.log(error.message);
  }
}


const loadEditProfile = async (req, res) => {
  try {
    const id = req.session.user._id;
    const user = await User.findOne({ _id: id })
    const addresses = await Address.find({ user: id })
    const orders = await Order.find({ customerId: id })

    res.render('editProfile', { user,addresses, orders })
  } catch (error) {
    console.log(error.message);
  }
}

// viewOrderdetails Page

const viewOrderdetails = async (req, res) => {
  try {
    const id = req.session.user._id;
    const user = await User.findOne({ _id: id });
    const orderId = req.query.orderId;

    const orders = await Order.findOne({ orderId: orderId }).populate('items.productId')
    //console.log(orders," !!See Order Details !!")

    const productData = orders.items
    //console.log(productData," !!See product Details !!")

    res.render('viewOrderdetails', { user, orders, productData })
  } catch (error) {
    console.log(error.message);
  }
}



const editProfile = async (req, res) => {
  try {
    const id = req.session.user._id;
    const { name, email, mobile } = req.body;
    const addresses = await Address.find({ user: id })
    const orders = await Order.find({ customerId: id })
    const updatedFields = {};
    if (name) {
      updatedFields.name = name;
    }
    if (email) {
      updatedFields.email = email;
    }
    if (mobile) {
      updatedFields.mobile = mobile;
    }
    const updatedUser = await User.findOneAndUpdate({_id: id},{$set: updatedFields},{new:true });
    //console.log(updatedUser);
    if (!updatedUser) {}
    else
      res.render('myProfile', {user: updatedUser, addresses: addresses,orders});
  } catch (error) {
    console.log(error.message);
  }
};


const addAddress = async (req, res) => {
  try {
    const id = req.session.user._id;
    const user = await User.findOne({ _id: id })
    const orders = await Order.find({ customerId: id })
   

    if (!user) {
      console.log("User not found.");
      return res.redirect("/myProfile");
    }

    const name = req.body.name;
    const housename = req.body.housename;
    const street = req.body.street;
    const city = req.body.city;
    const state = req.body.state;
    const pincode = req.body.pincode;

    // Create a new address object
    const newAddress = new Address({
      user: id,
      name: name,
      housename: housename,
      street: street,
      city: city,
      state: state,
      pincode: pincode,
    });
    const addressData = await newAddress.save();

    res.redirect("/myProfile");
  } catch (error) {
    console.error(error);
    // Handle the error appropriately
  }
};


const instantAddAddress = async (req, res) => {
  try {
    const id = req.session.user._id;
    const user = await User.findOne({ _id: id })
    const orders = await Order.find({ customerId: id })
   
    const name = req.body.name;
    const housename = req.body.housename;
    const street = req.body.street;
    const city = req.body.city;
    const state = req.body.state;
    const pincode = req.body.pincode;

    // Create a new address object
    const newAddress = new Address({
      user: id,
      name: name,
      housename: housename,
      street: street,
      city: city,
      state: state,
      pincode: pincode,
    });
    const addressData1 = await newAddress.save();

    res.redirect("/checkout");
  } catch (error) {
    console.error(error);
    }
};


const loadEditAddress = async (req, res) => {
  try {
    const id = req.session.user._id;
    const addressId = req.query.id;
    const user = await User.findOne({ _id: id })
 
    const addressData = await Address.find({ _id: addressId})  
    const addresses = addressData[0];
    res.render('editAddress', { addresses: addresses, user: user})
  }
  catch (error) {
    console.log(error.message)
  }
}


const editAddress = async (req, res) => {
  try {
    const id = req.session.user._id;
    const user = await User.findOne({ _id: id });
    const addressId = req.query.id;
    const orders = await Order.find({ customerId: id })
    const { name, housename, street, city, state, pincode } = req.body;
    const addressData = await Address.find({ _id: addressId});
    const addresses = addressData[0];
    const updatedFields = {};
    if (name) {
      updatedFields.name = name;
    }
    if (housename) {
      updatedFields.housename = housename;
    }
    if (street) {
      updatedFields.street = street;
    }
    if (city) {
      updatedFields.city = city;
    }
    if (state) {
      updatedFields.state = state;
    }
    if (pincode) {
      updatedFields.pincode = pincode;
    }
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: addresses._id },
      { $set: updatedFields },
      { new: true } // To return the updated document
    );
    res.redirect('/myProfile');
  }
  catch (error) {
    console.log(error.message)
  }
}


const deleteAddress = async (req, res) => {
  try {
    const id = req.query.id;
    await Address.deleteOne({ _id: id });
    res.redirect('/myProfile');
  }
  catch (error) {
    console.log(error.message);

  }
}




module.exports = {
  loadmyProfile,
  loadEditProfile,
  editProfile,
  addAddress,
  loadEditAddress,
  editAddress,
  deleteAddress,
  viewOrderdetails,
  orderListingUserside,
  instantAddAddress,

};