import Movie from "../models/movie.model.js";
import Cinema from "../models/cinema.model.js";
import { AppError } from "../utils/errors.js";

class MovieService {

    async add(userId, data) {
        const cinema = await Cinema.findOne({ owner: userId });
        if (! cinema) {
            throw new AppError("Vous n'avez pas de cinéma", 400);
        }

        const exists = await Movie.findOne({ cinema: cinema._id, tmdbId: data.tmdbId });
        if (exists) {
            throw new AppError("Ce film est déjà dans votre catalogue", 400);
        }

        return Movie.create({ ...data, cinema: cinema._id });
    }

    async getByCinema(cinemaId, status = null) {
        const query = { cinema: cinemaId };
        if (status) {
            query.status = status;
        }
        return Movie.find(query).sort({ createdAt: -1 });
    }

    async getMyMovies(userId, status = null) {
        const cinema = await Cinema.findOne({ owner: userId });
        if (! cinema) {
            return [];
        }

        return this.getByCinema(cinema._id, status);
    }

    async update(userId, movieId, data) {
        const cinema = await Cinema.findOne({ owner: userId });
        if (! cinema) {
            throw new AppError("Vous n'avez pas de cinéma", 400);
        }

        const movie = await Movie.findOneAndUpdate(
            { _id: movieId, cinema: cinema._id },
            data,
            { new: true }
        );

        if (! movie) {
            throw new AppError("Film non trouvé", 404);
        }

        return movie;
    }

    async delete(userId, movieId) {
        const cinema = await Cinema.findOne({ owner: userId });
        if (! cinema) {
            throw new AppError("Vous n'avez pas de cinéma", 400);
        }

        const movie = await Movie.findOneAndDelete({ _id: movieId, cinema: cinema._id });
        if (! movie) {
            throw new AppError("Film non trouvé", 404);
        }

        return movie;
    }
}

export default new MovieService();