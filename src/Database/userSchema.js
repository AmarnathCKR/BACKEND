const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
   name : String,
   email : String,
   password : String,
   watchlist : [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
