

const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        movieId: {
            type: mongoose.Types.ObjectId,
            ref: "movie",
        },
        rating: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Rating", RatingSchema);
