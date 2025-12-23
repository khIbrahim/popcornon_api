import Movie from "../models/movie.model.js";

class PublicMoviesController {

    getAll = async (req, res) => {
        try {
            const { genre, wilaya, date } = req.query;

            const matchQuery = { status: "active" };

            if (genre) {
                matchQuery.genres = genre;
            }
            if (date) {
                matchQuery.date = date;
            }

            const pipeline = [
                { $match:  matchQuery },
                {
                    $lookup: {
                        from: "cinemas",
                        localField:  "cinema",
                        foreignField: "_id",
                        as: "cinema"
                    }
                },
                { $unwind: "$cinema" },

                ...(wilaya ? [{ $match: { "cinema. wilaya": wilaya } }] : []),

                {
                    $group: {
                        _id: "$tmdbId",
                        movieId: { $first: "$_id" }, // ← Garde l'ID de la séance
                        tmdbId: { $first: "$tmdbId" },
                        title: { $first: "$title" },
                        poster: { $first: "$poster" },
                        backdrop: { $first: "$backdrop" },
                        runtime: { $first: "$runtime" },
                        voteAverage: { $first:  "$voteAverage" },
                        genres: { $first: "$genres" },
                        releaseDate: { $first: "$releaseDate" },
                        overview: { $first: "$overview" },
                        screenings: {
                            $push: {
                                _id:  "$_id",
                                cinema: {
                                    _id: "$cinema._id",
                                    name: "$cinema.name",
                                    city: "$cinema.city",
                                    wilaya: "$cinema.wilaya"
                                },
                                date: "$date",
                                time: "$time",
                                hall: "$hall",
                                price: "$price"
                            }
                        }
                    }
                },
                { $sort: { releaseDate: -1 } }
        ];

            const movies = await Movie.aggregate(pipeline);

            return res.json({
                success: true,
                count: movies.length,
                data: movies. map(m => ({
                    _id:  m. movieId,
                    tmdbId: m.tmdbId,
                    title: m.title,
                    poster: m.poster,
                    backdrop: m.backdrop,
                    runtime: m.runtime,
                    voteAverage:  m.voteAverage,
                    genres: m.genres,
                    releaseDate: m.releaseDate,
                    overview: m.overview,
                    screenings: m.screenings
                }))
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Erreur serveur"
            });
        }
    };

    getOne = async (req, res) => {
        try {
            const {id} = req.params;

            const screening = await Movie.findById(id);
            if(! screening || screening.status !== "active") {
                return res.status(404).json({
                    success: false,
                    message: "Séance introuvable",
                });
            }

            const result = await Movie.aggregate([
                {$match: {tmdbId: screening.tmdbId, status: "active"}},
                {
                    $lookup: {
                        from: "cinemas",
                        localField: "cinema",
                        foreignField: "_id",
                        as: "cinema"
                    }
                },
                {$unwind: "$cinema"},
                {
                    $group: {
                        _id: "$tmdbId",
                        movieId: { $first: "$_id" },
                        tmdbId: { $first: "$tmdbId" },
                        title: { $first: "$title" },
                        poster: { $first: "$poster" },
                        backdrop: { $first: "$backdrop" },
                        runtime: { $first: "$runtime" },
                        voteAverage: { $first: "$voteAverage" },
                        genres: { $first: "$genres" },
                        releaseDate: { $first: "$releaseDate" },
                        overview: { $first: "$overview" },
                        screenings: {
                            $push: {
                                _id: "$_id",
                                cinema: {
                                    _id: "$cinema._id",
                                    name: "$cinema.name",
                                    city: "$cinema.city",
                                    wilaya: "$cinema.wilaya",
                                },
                                date: "$date",
                                time: "$time",
                                hall: "$hall",
                                price: "$price",
                            },
                        },
                    }
                }
            ]);

            if(! result || result.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Film introuvable",
                });
            }

            const movie = result[0];

            return res.json({
                success: true,
                data: {
                    _id: movie. movieId,
                    tmdbId: movie.tmdbId,
                    title: movie.title,
                    poster: movie.poster,
                    backdrop: movie.backdrop,
                    runtime: movie.runtime,
                    voteAverage: movie.voteAverage,
                    genres: movie.genres,
                    releaseDate: movie.releaseDate,
                    overview: movie.overview,
                },
                screenings: movie.screenings,
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
