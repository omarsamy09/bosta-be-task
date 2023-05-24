const mongoose = require("mongoose");

const checkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  protocol: {
    type: String,
    enum: ["HTTP", "HTTPS", "TCP"],
    required: true,
  },
  path: {
    type: String,
    default: "/",
  },
  port: Number,
  timeout: {
    type: Number,
    default: 5 * 1000,
  },
  interval: {
    type: Number,
    default: 600 * 1000,
  },
  threshold: {
    type: Number,
    default: 1,
  },
  authentication: {
    username: String,
    password: String,
  },
  httpHeaders: [
    {
      key: String,
      value: String,
    },
  ],
  assert: {
    statusCode: Number,
  },
  tags: [String],
  ignoreSSL: {
    type: Boolean,
    default: false,
  },
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Report",
  },
});

const Check = mongoose.model("Check", checkSchema);

module.exports = Check;
