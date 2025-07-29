
const express_support = require("express");
const { supportController } = require("../controllers/SupportQuery.model");
const supportRouter = express_support.Router();

// Route for client-side widget to submit a query
supportRouter.post("/queries", supportController.createSupportQuery);

// Routes for admin panel
supportRouter.get("/queries", supportController.getAllSupportQueries);
supportRouter.put("/queries/:queryId/status", supportController.updateQueryStatus);

module.exports.supportRoute = supportRouter;