const express = require("express");
const router = express.Router();
const {
  createCheck,
  getCheck,
  getChecks,
  deleteCheck,
  updateCheck,
} = require("../services/check");
const { isAuthenticated } = require("../middlewares/auth");

router.post("/", isAuthenticated, createCheck);
router.get("/", isAuthenticated, getChecks);
router.get("/:checkId", isAuthenticated, getCheck);
router.delete("/:checkId", isAuthenticated, deleteCheck);
router.put("/:checkId", isAuthenticated, updateCheck);

module.exports = router;
