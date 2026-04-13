const express = require("express");
const Job = require("../models/Job");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All job routes are protected
router.use(protect);

// @GET /api/jobs/analytics
router.get("/analytics", async (req, res) => {
  try {
    const userId = req.user._id;

    const totalJobs = await Job.countDocuments({ createdBy: userId });

    // Jobs by work type
    const byWorkType = await Job.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: "$workType", count: { $sum: 1 }, workers: { $sum: "$workers" } } },
      { $sort: { count: -1 } },
    ]);

    // Jobs by location
    const byLocation = await Job.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Jobs by status
    const byStatus = await Job.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Jobs by priority
    const byPriority = await Job.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    // Jobs over last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const jobsTrend = await Job.aggregate([
      { $match: { createdBy: userId, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalWorkers = await Job.aggregate([
      { $match: { createdBy: userId } },
      { $group: { _id: null, total: { $sum: "$workers" } } },
    ]);

    res.json({
      success: true,
      data: {
        totalJobs,
        totalWorkers: totalWorkers[0]?.total || 0,
        byWorkType,
        byLocation,
        byStatus,
        byPriority,
        jobsTrend,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @GET /api/jobs
router.get("/", async (req, res) => {
  try {
    const { status, workType, location, search, sort = "-createdAt", page = 1, limit = 20 } = req.query;

    const query = { createdBy: req.user._id };
    if (status) query.status = status;
    if (workType) query.workType = workType;
    if (location) query.location = new RegExp(location, "i");
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { location: new RegExp(search, "i") },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("createdBy", "name email");

    res.json({
      success: true,
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @POST /api/jobs
router.post("/", async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @PUT /api/jobs/:id
router.put("/:id", async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @DELETE /api/jobs/:id
router.delete("/:id", async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!job) return res.status(404).json({ success: false, message: "Job not found." });
    res.json({ success: true, message: "Job deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
