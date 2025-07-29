const SupportQueryModel = require("../models/SupportQuery.model");
const { handleError } = require("../helpers/handleError");

// Called from the client-side chat widget to create a new query
const createSupportQuery = async (req, res, next) => {
  try {
    const { name, mobile, queryType, message } = req.body;

    if (!name || !mobile || !queryType || !message) {
      return next(handleError(400, "All fields are required."));
    }

    const newQuery = new SupportQueryModel({ name, mobile, queryType, message });
    await newQuery.save();
    res.status(201).json({ success: true, message: "Your query has been submitted successfully! We will get back to you soon." });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// Called from the admin panel to get all queries
const getAllSupportQueries = async (req, res, next) => {
  try {
    const queries = await SupportQueryModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, queries });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// Called from the admin panel to update a query's status
const updateQueryStatus = async (req, res, next) => {
    try {
        const { queryId } = req.params;
        const { status } = req.body;

        if (!status) {
            return next(handleError(400, "Status is required."));
        }

        const updatedQuery = await SupportQueryModel.findByIdAndUpdate(
            queryId,
            { status },
            { new: true }
        );

        if (!updatedQuery) {
            return next(handleError(404, "Query not found."));
        }

        res.status(200).json({ success: true, message: "Status updated successfully.", query: updatedQuery });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

module.exports.supportController = {
  createSupportQuery,
  getAllSupportQueries,
  updateQueryStatus
};
