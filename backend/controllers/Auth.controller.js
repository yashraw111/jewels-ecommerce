const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Auth.model");
const { handleError } = require("../helpers/handleError");

const Register = async (req, res, next) => {
  try {
    const { fullName, name, email, password, confirmPassword } = req.body;
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return next(handleError(400, "Email already registered"));
    }
    if (password !== confirmPassword) {
      return next(handleError(400, "Passwords do not match"));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      fullName,
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({ success: true, message: "Registration successful" });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(handleError(404, "Invalid login credentials."));
    }
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return next(handleError(401, "Invalid login credentials."));
    }
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
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

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      user: userData,
      message: "Login successful.",
    });
  } catch (error) {
    console.log("Login Error:", error.message);
    return next(handleError(500, "Something went wrong. Please try again."));
  }
};

const GoogleLogin = async (req, res, next) => {
  console.log(req.body)
  try {
    const { name, email, avatar } = req.body;
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        avatar,
        password: "", // 👈 Since Google login has no password
      });
      await user.save();
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
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

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      success: true,
      user: userData,
      message: "Google Login successful.",
    });
  } catch (error) {
    console.log("Google Login Error:", error.message);
    return next(handleError(500, "Google login failed"));
  }
};
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, name, bio } = req.body;
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, name, bio },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return next(handleError(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};


module.exports = {
  Register,
  Login,
  updateProfile,  
  GoogleLogin, // 👈 export it
};


