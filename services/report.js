const Check = require("../models/check");
const Report = require("../models/report");

const getReport = async (req, res) => {
  try {
    const reportId = req.params.reportId;
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getReports = async (req, res) => {
  try {
    const tags = req.query.tags;
    const query = tags ? { tags: { $in: tags } } : {};
    const checks = await Check.find(query).populate("report");
    const reports = checks.map((check) => check.report);
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getReport,
  getReports,
};
