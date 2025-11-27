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
    overview: {
        type: String,
        required: true
    },
    poster: {
        type: String,
        required: true
    },
    backdrop: {
        type: String,
        required: true
    },
    releaseDate: {
        type: String,
        required: true
    },
    runtime: {
        type: Number,
        required: false // des fois l'api de tmdb ne donne pas forcément la durée, bzr et chiant
    },
    genres: {
        type: [String],
        required: false // idem pour les genres, ça peut donner un tableau vide
    },
    voteAverage: {
        type: Number,
        required: true
    },
    cinema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cinema",
        required: true
    },

    // Séance MVP jrappelle
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    hall: {
        type: String,
        required: true,
    },

    //crud
    status: {
        type: String,
        enum: ["active", "draft", "archived"],
        default: "draft"
    },
}, { timestamps: true });

//tant qu'on n'a pas de model pour gérer les doublons, on autorise les doublons de films dans un même cinéma
// movieSchema.index({ cinema: 1, tmdbId: 1 }, { unique: true });

export default mongoose.model("Movie", movieSchema);