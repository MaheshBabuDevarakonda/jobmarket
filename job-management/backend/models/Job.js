const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    workType: {
      type: String,
      required: [true, "Work type is required"],
      enum: [
        "Construction",
        "Electrical",
        "Plumbing",
        "Carpentry",
        "Painting",
        "Landscaping",
        "IT & Tech",
        "Maintenance",
        "Cleaning",
        "Logistics",
        "Other",
      ],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    workers: {
      type: Number,
      required: [true, "Number of workers is required"],
      min: [1, "At least 1 worker required"],
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    estimatedHours: {
      type: Number,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Index for analytics queries
jobSchema.index({ workType: 1, location: 1, status: 1, date: -1 });

module.exports = mongoose.model("Job", jobSchema);
