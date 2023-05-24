const mongoose = require("mongoose");
const reportSchema = new mongoose.Schema({
  checkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Check",
    required: true,
  },
  checkName: {
    type: String,
  },
  status: {
    type: String,
    default: "",
  },
  availability: {
    type: Number,
    default: 0,
  },
  outages: {
    type: Number,
    default: 0,
  },
  downtime: {
    type: Number,
    default: 0,
  },
  uptime: {
    type: Number,
    default: 0,
  },
  responseTime: {
    type: Number,
    default: 0,
  },
  history: {
    type: [
      {
        timestamp: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
        },
        responseTime: {
          type: Number,
        },
      },
    ],
    default: [],
  },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
