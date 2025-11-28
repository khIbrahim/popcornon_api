import Movie from "../models/movie.model.js";

class PublicMoviesController {

    getAll = async (req, res) => {
        try {
            const { genre, wilaya, date } = req.query;

            const query = { status: "active" };

            if (genre) {
                query.genres = genre;
            }

            if (wilaya) {
                query["cinema.wilaya"] = wilaya;
            }

            if (date) {
                query.date = date;
            }

            const movies = await Movie.find(query)
                .populate("cinema", "name city wilaya")
                .sort({ time: 1, releaseDate: -1 });

            return res.json({
                success: true,
                count: movies.length,
                data: movies. map(this.#mapToPublicMovie),
            });
        } catch (err) {
            console.error(err);
            return res. status(500).json({
                success: false,
                message: "Erreur serveur",
            });
        }
    };

    getOne = async (req, res) => {
        try {
            const movie = await Movie.findById(req.params.id)
                .populate("cinema", "name city wilaya");

            if (!movie || movie.status !== "active") {
                return res.status(404).json({
                    success: false,
                    message: "Film introuvable",
                });
            }

            return res.json({
                success: true,
                data: this.#mapToPublicMovie(movie),
                screenings: [
                    {
                        _id: movie._id,
                        cinema: {
                            _id: movie.cinema._id,
                            name: movie.cinema.name,
                            city: movie.cinema.city,
                            wilaya: movie.cinema.wilaya,
                        },
                        date: movie.date,
                        time: movie.time,
                        hall: movie.hall,
                        price: movie.price,
                    }
                ]
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
            });
        }
    };

    #mapToPublicMovie(movie) {
        return {
            _id: movie._id,
            tmdbId: movie.tmdbId,
            title: movie.title,
            poster: movie.poster,
            backdrop: movie.backdrop,
            runtime: movie.runtime,
            voteAverage: movie.voteAverage,
            genres: movie.genres,
            releaseDate: movie.releaseDate,
            overview: movie.overview,
        };
    }
}

export default new PublicMoviesController();
