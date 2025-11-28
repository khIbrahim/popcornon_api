import Movie from "../models/movie.model.js";
import Cinema from "../models/cinema.model.js";

class SearchController {
    search = async (req, res) => {
        try {
            const { q } = req.query;

            if (! q || q.length < 2) {
                return res. json({
                    success: true,
                    data: { movies: [], cinemas: [] },
                });
            }

            const regex = new RegExp(q, "i");

            const movies = await Movie.find({
                status: "active",
                $or: [
                    { title: regex },
                    { genres: regex },
                ],
            })
                .select("title poster genres runtime voteAverage")
                .limit(5)
                .lean();

            const cinemas = await Cinema.find({
                status: "active",
                $or: [
                    { name: regex },
                    { city: regex },
                    { wilaya: regex },
                ],
            })
                . select("name city wilaya")
                . limit(5)
                .lean();

            return res.json({
                success: true,
                data: { movies, cinemas },
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
            });
        }
    };
}

export default new SearchController();