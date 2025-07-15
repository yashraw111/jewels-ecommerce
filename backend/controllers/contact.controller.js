const Contact = require("../models/Contact");

const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const contact = new Contact({ name, email, message });
    await contact.save();

    res.status(201).json({ success: true, message: "Message received successfully!", contact });
  } catch (error) {
    console.error("Error in createContact:", error);
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, contacts });
  } catch (error) {
    console.error("Error in getAllContacts:", error);
    res.status(500).json({ success: false, message: "Failed to get contact messages" });
  }
};
 const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }
    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

module.exports = { createContact, getAllContacts,deleteContact };
