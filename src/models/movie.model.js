import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    tmdbId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    originalTitle: String,
    overview: String,
    poster: String,
    backdrop: String,
    releaseDate: Date,
    runtime: Number,
    genres: [String],
    voteAverage: Number,
    cinema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cinema",
        required: true
    },
    status: {
        type: String,
        enum: ["active", "draft", "archived"],
        default: "draft"
    },
    basePrice: {
        type: Number,
        default: 500
    }
}, { timestamps: true });

movieSchema.index({ cinema: 1, tmdbId: 1 }, { unique: true });

export default mongoose.model("Movie", movieSchema);