const { Register, Login, GoogleLogin, updateProfile, toggleWishlist } = require("../controllers/Auth.controller");

const AuthRoute = require("express").Router();

AuthRoute.post("/register", Register);
AuthRoute.post("/login", Login);
AuthRoute.post("/google-login", GoogleLogin); // 👈 new route
AuthRoute.put("/update-profile/:id", updateProfile);


module.exports = AuthRoute;
