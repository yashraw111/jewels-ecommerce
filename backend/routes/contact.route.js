const express = require("express");
const router = express.Router();
const { createContact, getAllContacts, deleteContact } = require("../controllers/contact.controller");

router.post("/contact", createContact);
router.get("/contact", getAllContacts); // 👈 New route to get all messages
router.delete('/contact/:id', deleteContact); // 👈 new

module.exports = router;
