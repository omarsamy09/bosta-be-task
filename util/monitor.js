const axios = require("axios");
const https = require("https");
const { performance } = require("perf_hooks");
const Report = require("../models/report");
const User = require("../models/user");
const Check = require("../models/check");
const { sendNotificationEmail } = require("./email");

const registerCheck = (check, report) => {
  try {
    setInterval(async () => {
      const options = {
        method: "GET",
        url: `${check.protocol}://${check.url}${check.path}`,
        timeout: check.timeout,
        httpsAgent: new https.Agent({ rejectUnauthorized: !check.ignoreSSL }),
      };

      if (check.port) {
        options.url = `${check.protocol}://${check.url}:${check.port}${check.path}`;
      }

      if (check.authentication) {
        const { username, password } = check.authentication;
        options.auth = {
          username,
          password,
        };
      }

      if (check.httpHeaders) {
        for (const [headerName, headerValue] of Object.entries(
          check.httpHeaders
        )) {
          if (headerName && headerName.trim() !== "") {
            options.headers[headerName] = headerValue;
          }
        }
      }

      const startTime = performance.now();
      const response = await axios(options);
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      report.responseTime = (report.responseTime + responseTime) / 2;

      if (check.assert && check.assert.statusCode) {
        if (check.assert.statusCode === response.status) {
          report.status = "Up";
          report.uptime = (report.uptime + responseTime) / 1000;
        } else {
          report.status = "Down";
          report.outages++;
          report.downtime = (report.downtime + responseTime) / 1000;
        }
      } else {
        if (response.status < 400) {
          report.status = "Up";
          report.uptime = (report.uptime + responseTime) / 1000;
        } else {
          report.status = "Down";
          report.outages++;
          report.downtime = (report.downtime + responseTime) / 1000;
        }
      }
      if (report.outages > 0 && report.outages % check.threshold === 0) {
        const user = await User.findOne({ id: check.userID });
        sendNotificationEmail(user.email, check.url);
      }
      report.availability =
        (report.uptime / (report.uptime + report.downtime)) * 100;
      report.history.push({
        timestamp: Date.now(),
        status: report.status,
        responseTime: report.responseTime,
      });
      await report.save();
    }, check.interval);
  } catch (error) {
    throw Error("Failed to register check");
  }
};

const runChecks = async () => {
  const checks = await Check.find({});
  checks.forEach(async (check) => {
    const report = await Report.findOne({ checkId: check.id });
    registerCheck(check, report);
  });
};

module.exports = {
  registerCheck,
  runChecks,
};
