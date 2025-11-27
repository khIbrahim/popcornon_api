import catchAsync from "../utils/catchAsync.js";
import movieService from "../services/movie.service.js";

class MovieController {
    create = catchAsync(async(req, res) => {
        try {
            const movie = await movieService.create(req.user._id, req.body);

            return res.status(201).json({
                success: true,
                message: "Film ajouté avec succès",
                data: movie
            })
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Erreur serveur"
            });
        }
    });

    getMyMovies = catchAsync(async(req, res) => {
        const { status, date } = req.query;
        const movies= await movieService.getMyMovies(req.user._id, {status, date});

        return res.json({
            success: true,
            count: movies.length,
            data: movies
        });
    })

    getByCinema = catchAsync(async(req, res) => {
        const { id } = req.params;
        const { status } = req.query;
        const movies = await movieService.getByCinema(id, status);

        return res.json({
            success: true,
            count: movies.length,
            data: movies
        });
    });

    update = catchAsync(async(req, res) => {
        const { id } = req.params;
        try {
            const movie = await movieService.update(req.user._id, id, req.body);

            return res.json({
                success: true,
                message: "Film mis à jour avec succès",
                data: movie
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Erreur serveur"
            });
        }
    });

    delete = catchAsync(async(req, res) => {
        const { id } = req.params;
        try {
            await movieService.delete(req.user._id, id);

            return res.json({
                success: true,
                message: "Film supprimé avec succès"
            });
        } catch (error) {
            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.message || "Erreur serveur"
            });
        }
    });

    archiveExpired = catchAsync(async (req, res) => {
        const result = await movieService.archiveExpired(req.user._id);

        res.json({
            success: true,
            message: `${result.modifiedCount} séance(s) archivée(s)`,
            archived: result.modifiedCount,
        });
    });
}

export default new MovieController();