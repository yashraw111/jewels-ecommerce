const { Register, Login } = require("../controllers/Admin.controller");

const AdminRoute = require("express").Router();

AdminRoute.post("/register", Register);
AdminRoute.post("/login", Login);

module.exports = AdminRoute;
