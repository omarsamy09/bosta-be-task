const Check = require("../models/check");
const Report = require("../models/report");
const { registerCheck } = require("../util/monitor");
const createCheck = async (req, res) => {
  try {
    const existingCheck = await Check.findOne({
      userId: req.userId,
      name: req.body.name,
    });

    if (existingCheck) {
      return res
        .status(409)
        .json({ message: "Check with this name already exist" });
    }
    const payload = req.body;
    payload.userId = req.userId;
    const newCheck = await Check.create(payload);

    const report = await Report.create({
      checkId: newCheck.id,
      checkName: newCheck.name,
    });

    newCheck.report = report;
    await newCheck.save();

    registerCheck(newCheck, report);
    res.status(201).json({ checkId: newCheck.id });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getChecks = async (req, res) => {
  try {
    const tags = req.query.tags;
    const query = tags ? { tags: { $in: tags } } : {};
    const checks = await Check.find({ userId: req.userId, ...query });
    res.status(200).json(checks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCheck = async (req, res) => {
  try {
    const check = await Check.findOne({ _id: req.params.checkId });
    if (!check) {
      return res.status(404).json({ message: "Check not found" });
    }
    if (req.userId != check.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this check" });
    }
    res.status(200).json(check);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCheck = async (req, res) => {
  try {
    const payload = req.body;

    const check = await Check.findById(req.params.checkId);
    if (!check) {
      return res.status(404).json({ message: "Check not found" });
    }
    if (req.userId != check.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this check" });
    }
    await Check.updateOne(payload);
    res.status(200).json({ message: "Check updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCheck = async (req, res) => {
  try {
    const check = await Check.findById(req.params.checkId);
    if (!check) {
      return res.status(403).json({ message: "Check already deleted" });
    }
    if (req.userId != check.userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this check" });
    }
    await Check.findByIdAndDelete(req.params.checkId);
    res.status(200).json({ message: "Check was deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCheck,
  getCheck,
  getChecks,
  deleteCheck,
  updateCheck,
};
