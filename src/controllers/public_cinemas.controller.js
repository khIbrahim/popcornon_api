import Cinema from "../models/cinema.model.js";
import Movie from "../models/movie.model.js";
import public_cinema_service from "../services/public_cinema_service.js";

class PublicCinemasController {

    getAll = async (req, res) => {
        try {
            const {
                wilaya,
                city,
                q,
                page  = 1,
                limit = 20,
                sort   = "createdAt",
                order  = "desc",
            } = req.query;

            const {pagination, data} = await public_cinema_service.getAll({wilaya, city, q, page, limit, sort, order});

            return res.json({
                success: true,
                pagination: pagination,
                data: data.map(this.#mapToPublicCinemaSummary),
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
            });
        }
    };

    search = async (req, res) => {
        try {
            const { q } = req.query;

            if (!q || q.trim().length < 2) {
                return res.json({
                    success: true,
                    count: 0,
                    data: [],
                });
            }

            const cinemas = await Cinema.find({
                status: "active",
                $text: { $search: q.trim() },
            })
                .select("name city wilaya address capacity")
                .limit(10)
                .lean();

            return res.json({
                success: true,
                count: cinemas.length,
                data: cinemas.map(this.#mapToPublicCinemaSummary),
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
            });
        }
    };

    getByName = async (req, res) => {
        try {
            const rawName = req.params.name || "";
            const decodedName = decodeURIComponent(rawName);

            if (! decodedName.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Nom de cinéma invalide",
                });
            }

            const escapedName = decodedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const nameRegex = new RegExp(`^${escapedName}$`, "i");

            const cinema = await Cinema.findOne({
                name: nameRegex,
                status: "active",
            })
                .lean();

            if (!cinema) {
                return res.status(404).json({
                    success: false,
                    message: "Cinéma introuvable",
                });
            }

            const screenings = await this.#getCinemaScreenings(cinema._id);

            return res.json({
                success: true,
                data: this.#mapToPublicCinemaDetail(cinema),
                screenings,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
            });
        }
    };

    getOne = async (req, res) => {
        try {
            const cinema = await Cinema.findById(req.params.id)
                .lean();

            if (!cinema || cinema.status !== "active") {
                return res.status(404).json({
                    success: false,
                    message: "Cinéma introuvable",
                });
            }

            const screenings = await this.#getCinemaScreenings(cinema._id);

            return res.json({
                success: true,
                data: this.#mapToPublicCinemaDetail(cinema),
                screenings,
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: "Erreur serveur",
            });
        }
    };

    async #getCinemaScreenings(cinemaId) {
        const movies = await Movie.find({
            cinema: cinemaId,
            status: "active",
        })
            .select("title poster runtime genres date time hall price")
            .sort({ date: 1, time: 1 })
            .lean();

        return movies.map((movie) => ({
            _id: movie._id,
            movieId: movie._id,
            title: movie.title,
            poster: movie.poster,
            runtime: movie.runtime,
            genres: movie.genres,
            date: movie.date,
            time: movie.time,
            hall: movie.hall,
            price: movie.price,
        }));
    }

    #mapToPublicCinemaSummary(cinema) {
        return {
            _id: cinema._id,
            name: cinema.name,
            description: cinema.description,
            address: cinema.address,
            city: cinema.city,
            wilaya: cinema.wilaya,
            capacity: cinema.capacity,
            totalHalls: Array.isArray(cinema.halls) ? cinema.halls.length : 0,
            socialLinks: cinema.socialLinks || {},
            phone: cinema.phone || "",
            website: cinema.website || "",
            stats: cinema.stats
                ? {
                    totalViews: cinema.stats.totalViews || 0,
                    totalMovies: cinema.stats.totalMovies || 0,
                    totalScreenings: cinema.stats.totalScreenings || 0,
                }
                : {
                    totalViews: 0,
                    totalMovies: 0,
                    totalScreenings: 0,
                },
            location: cinema.location || null,
        };
    }

    #mapToPublicCinemaDetail(cinema) {
        return {
            _id: cinema._id,
            name: cinema.name,
            description: cinema.description,
            address: cinema.address,
            city: cinema.city,
            wilaya: cinema.wilaya,
            phone: cinema.phone || "",
            email: cinema.email || "",
            website: cinema.website || "",
            socialLinks: cinema.socialLinks || {},
            capacity: cinema.capacity,
            halls: Array.isArray(cinema.halls)
                ? cinema.halls.map((hall) => ({
                    name: hall.name,
                    capacity: hall.capacity,
                    type: hall.type,
                }))
                : [],
            openingHours: cinema.openingHours || {},
            stats: cinema.stats
                ? {
                    totalViews: cinema.stats.totalViews || 0,
                    totalMovies: cinema.stats.totalMovies || 0,
                    totalScreenings: cinema.stats.totalScreenings || 0,
                }
                : {
                    totalViews: 0,
                    totalMovies: 0,
                    totalScreenings: 0,
                },
            location: cinema.location || null,
        };
    }
}

export default new PublicCinemasController();