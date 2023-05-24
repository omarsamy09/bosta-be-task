//this file is dedicated to handle any kind of connections 
const mongoose = require("mongoose");

module.exports = async function connectToMongoDB(connectionString) {
    try {
      await mongoose.connect(connectionString);
      console.log("Connected to Database");
    } catch (error) {
      console.log("Error connecting to Database ", error);
    }
  }