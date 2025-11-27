import Movie from "../models/movie.model.js";
import Cinema from "../models/cinema.model.js";
import {AppError} from "../utils/errors.js";
import cinemaService from "./cinema.service.js";

class MovieService {

    async create(userId, data) {
        const cinema = await cinemaService.getByOwner(userId);
        if (! cinema) {
            throw new AppError("Vous n'avez pas de cinéma", 400);
        }

        // const exists = await Movie.findOne({ cinema: cinema._id, tmdbId: data.tmdbId });
        // if (exists) {
        //     throw new AppError("Ce film est déjà dans votre catalogue", 400);
        // }

        return Movie.create({ ...data, cinema: cinema._id });
    }

    async getByCinema(cinemaId, status = null) {
        const query = { cinema: cinemaId };

        if (status) {
            query.status = status;
        }

        return Movie.find(query)
            .populate('cinema', 'name address phone')
            .sort({ createdAt: -1 });
    }

    async archiveExpired(userId) {
        const cinema = await Cinema.findOne({ owner: userId });
        if (! cinema) {
            return { modifiedCount: 0 };
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString().split("T")[0];

        return await Movie.updateMany(
            {
                cinema: cinema._id,
                date: {$lt: todayStr},
                status: {$ne: "archived"},
            },
            {
                $set: {status: "archived"},
            }
        );
    }

    async getMyMovies(userId, { date, status } = {}) {
        const cinema = await Cinema.findOne({ owner: userId });
        if (! cinema) return [];

        const query = { cinema: cinema._id };

        if (date) {
            query.date = date;
        }

        if (status) {
            query.status = status;
        }

        return Movie.find(query).sort({ time: 1, createdAt: -1 });
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