const express = require("express");
const router = express.Router();
const User = require("../models/users");
const mongoose = require("mongoose");
const Product = require("../models/products");
const Order = require("../models/order");
const Admin = require("../models/admin");
const ObjectId = mongoose.Types.ObjectId;


// Route for adding a user to the database
router.post("/add", async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });
    await user.save();
    req.session.message = {
      type: "success",
      message: "User added successfully",
    };
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Failed to add user",
    };
    res.status(500).redirect("/");
  }
});
// Route for adding a product to the database
router.post("/addProduct", async (req, res) => {
  try {
    const products = new Product({
      product_Name: req.body.product_Name,
      product_information: req.body.product_information,
      product_image: req.body.product_image,
    });
    await products.save();
    req.session.message = {
      type: "success",
      message: "Product added successfully",
    };
    res.redirect("/product");
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Failed to add product",
    };
    res.status(500).redirect("/product");
  }
});


// Route for rendering the index page
router.get("/", async (req, res) => {
  try {
    res.render("login", {
        title: "Home Page",
        page: "login",
    });
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Failed to fetch users",
    };
    res.redirect("/");
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const error = req.query.error;
  try {
      // Find admin by email
      const admin = await Admin.findOne({ email });

      if (!admin) {
          // If admin not found, redirect to login page with error message
          return res.render('login', { title: 'Login', error });
      }

      // Compare passwords
      if (password === admin.password) {
          // Passwords match, redirect to home page
          res.render('index', {
              title: 'Home Page',
              page: 'home',
          });
      } else {
          // Passwords don't match, redirect to login page with error message
          res.render('login', { title: 'Login', error });
      }
  } catch (err) {
      console.error(err);
      // If any error occurs during the process, redirect to login page with a generic error message
      return res.redirect('/?error=An error occurred while logging in');
  }
});

// Route for rendering the index page
router.get("/home", async (req, res) => {

  try {

    res.render("index", {
        title: "Home Page",
        page: "home",
    });
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Failed to fetch users",
    };
    res.redirect("/");
  }
});

// Route for rendering the user home page
router.get("/user", async (req, res) => {
  try {
    const users = await User.find().exec(); // Fetch users from the database
    const message = req.session.message; // Retrieve the message from the session
    delete req.session.message; // Remove the message from the session

    res.render("index", {
      title: "User Page",
      page: "user",
      users: users, // Pass the users data to the view
      message: message, // Pass the message to the view
    });
    // Your logic for rendering the user home page
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Failed to render user home",
    };
    res.redirect("/");
  }
});
router.get("/product", async (req, res) => {
  try {
    const products = await Product.find().exec(); // Fetch users from the database
    const message = req.session.message; // Retrieve the message from the session
    delete req.session.message; // Remove the message from the session

    res.render("index", {
      title: "Product Page",
      page: "product",
      products: products, // Pass the users data to the view
      message: message, // Pass the message to the view
    });
    // Your logic for rendering the user home page
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Failed to render user home",
    };
    res.redirect("/");
  }
});

//Route to render order details
router.get("/order", async (req, res) => {
  try {
    const order = await Order.find().populate('user').exec();

    const message = req.session.message; // Retrieve the message from the session
    delete req.session.message; // Remove the message from the session
    // }
    res.render("index", {
      title: "Order Page",
      page: "order",
      order: order, // Pass the users data to the view
      message: message, // Pass the message to the view
    });
    // Your logic for rendering the user home page
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Failed to render user home",
    };
    res.redirect("/");
  }
});

// Edit a user route
router.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).exec();

    if (!user) {
      return res.redirect("/");
    }

    res.render("edit_users", {
      title: "Edit User",
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// Edit a user route
router.get("/edit/product/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const products = await Product.findById(id).exec();

    if (!products) {
      return res.redirect("/product");
    }

    res.render("product/edit_product", {
      title: "Edit product",
      products: products,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/product");
  }
});

router.post("/update/product/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        product_Name: req.body.product_Name,
        product_image: req.body.product_image,
        product_information: req.body.product_information,
      },
      { new: true }
    );

    if (!updatedProduct) {
      throw new Error("User not found");
    }
 
    req.session.message = {
      type: "success",
      message: "Product updated successfully",
    };
    res.redirect("/product");    
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: err.message,
    };
    res.redirect("/product");
  }
});

router.post("/update/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }
 
    req.session.message = {
      type: "success",
      message: "User updated successfully",
    };
    res.redirect("/");    
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: err.message,
    };
    res.redirect("/");
  }
});

router.get("/edit/order/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).populate('user').exec();

    if (!order) {
      return res.redirect("/order");
    }

    res.render("order/edit_order", {
      title: "Edit product",
      order: order,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/product");
  }
});

// Delete user route functionality goes here
router.get("/delete/:id", (req, res) => {
  let id = req.params.id;
  User.findOneAndDelete({ _id: id })
    .exec()
    .then((result) => {

      req.session.message = {
        type: "danger",
        message: "User deleted successfully",
      };

      res.redirect("/");
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
});
// Delete user route functionality goes here
router.get("/delete/product/:id", (req, res) => {
  let id = req.params.id;
  Product.findOneAndDelete({ _id: id })
    .exec()
    .then((result) => {

      req.session.message = {
        type: "danger",
        message: "User deleted successfully",
      };

      res.redirect("/product");
    })
    .catch((err) => {
      res.json({ message: err.message });
    });
});

// Route for rendering the add_users page
router.get("/add", (req, res) => {
  res.render("add_users", {
    title: "User Page",
  });
});

// Route for rendering the add product page
router.get("/addProduct", (req, res) => {
  res.render("product/add_product", { title: "Add Product" });
});

module.exports = router;
