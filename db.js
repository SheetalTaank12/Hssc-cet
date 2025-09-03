// this file is for making connection with the db  




if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}




const mongoose = require("mongoose");
const dbUrl = process.env.ATLAS_DB_URL;  //now mongo will connect to atlas db which is hosted online, and not to our local db

async function connectDB() {
  await mongoose.connect(dbUrl);
  console.log("Connected to DB");
}

module.exports = connectDB;
