const express = require("express");
const userController = require("./controllers/user");
const checksController = require("./controllers/check");
const reportsController = require("./controllers/report");
const connectToMongoDb = require("./util/connection");
const { runChecks } = require("./util/monitor");
const { config } = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const fs = require("fs");
config();

const openApiFilePath = path.resolve(__dirname, "./openapi.json");
const openApiData = fs.readFileSync(openApiFilePath, "utf8");
const openApiDocument = JSON.parse(openApiData);

const mongoDbConnectionString = process.env.MONGO_CONNECTION_STRING;
const port = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/users", userController);
app.use("/checks", checksController);
app.use("/reports", reportsController);
app.use("/api", swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.listen(port, async () => {
  await connectToMongoDb(mongoDbConnectionString);
  await runChecks();
  console.log("listening");
});
