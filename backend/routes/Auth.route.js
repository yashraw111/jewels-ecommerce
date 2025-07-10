const { Register, Login } = require("../controllers/Auth.controller");

const AuthRoute = require("express").Router();

AuthRoute.post("/register", Register);
AuthRoute.post("/login", Login);

module.exports = AuthRoute;
