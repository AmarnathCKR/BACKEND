const mongoose = require("mongoose");
require('dotenv').config()

//Set URI
const URI = "mongodb+srv://ckramarnath:G7R43r2BtZXCqd4o@edugo.huyeyb6.mongodb.net/moviesData?retryWrites=true&w=majority";
const db = mongoose.connection;
//Config Object to Avoid Deprecation Warnings
const config = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(URI, config);

//CONNECTION EVENTS
db.on("open", () => {
  console.log(`You are connected to MongoDB`);
})
  .on("error", (err) => {
    console.log(err);
  })
  .on("close", () => {
    console.log(`You are no longer connected to Mongo`);
  });

module.exports = mongoose
