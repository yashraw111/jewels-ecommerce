// controllers/auth.controller.js
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin.model");
const { handleError } = require("../helpers/handleError");

const Register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    const checkUser = await Admin.findOne({ email });

    if (checkUser) {
      return next(handleError(400, "Email already registered"));
    }
    if (password !== confirmPassword) {
      return next(handleError(400, "Passwords do not match"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new Admin({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(200).json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.log(error);
    next(handleError(500, error.message));
  }
};

const Login = async (req, res, next) => {
  console.log(req.body)
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    console.log(admin)
    if (!admin) {
      res.json({
        success:false,
        message:"Invalid login credentials"
      })
    }
    else{

       const isPasswordMatch = await bcryptjs.compare(password, admin.password);
    if (!isPasswordMatch) {
      // return next(handleError(401, "Invalid login credentials."));
      console.log("Invalid login credentials")

    }

    const token = jwt.sign(
      {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    const userData = admin.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      user: userData,
      message: "Login successful.",
    });
    }

   
  } catch (error) {
    console.log("Login Error:", error.message);
    next(handleError(500, "Something went wrong. Please try again."));
  }
};

module.exports = { Register, Login };
