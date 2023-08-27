const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title : String,
    genre: String,
    director: String,
    year: String,
    actors: String,
    plot: String,
    runtime: String,
    rating: String,
    language: String,
    country: String,
    image : String,
    user : {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", MovieSchema);