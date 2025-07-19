const express = require("express");
const { addNotifyRequest } = require("../controllers/Notify.controller");

const router = express.Router();

router.post("/", addNotifyRequest);

module.exports = router;
