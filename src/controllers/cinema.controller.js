import catchAsync from "../utils/catchAsync.js";
import cinemaService from "../services/cinema.service.js";

class CinemaController {
    me = catchAsync(async (req, res) => {
        const cinema = await cinemaService.getByOwner(req.user._id);

        if (!cinema) {
            return res.status(404).json({
                success: false,
                message: "Vous n'avez pas de cinéma associé à ce compte",
            });
        }

        res.json({
            success: true,
            data: cinema
        });
    });

    getById = catchAsync(async (req, res) => {
        const cinema = await cinemaService.getById(req.params.id);

        res.json({
            success: true,
            data: cinema
        });
    });

    getAll = catchAsync(async (req, res) => {
        const { wilaya, city } = req.query;
        const cinemas = await cinemaService.getAll({ wilaya, city });

        res.json({
            success: true,
            count: cinemas.length,
            data: cinemas
        });
    });

    search = catchAsync(async (req, res) => {
        const { q } = req.query;

        if (! q || q.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Terme de recherche trop court (min 2 caractères)"
            });
        }

        const cinemas = await cinemaService.search(q);

        res.json({
            success: true,
            count: cinemas.length,
            data: cinemas
        });
    });

    create = catchAsync(async (req, res) => {
        const cinema = await cinemaService.create(req.user._id, req.body);

        res.status(201).json({
            success: true,
            message: "Cinéma créé avec succès",
            data: cinema
        });
    });

    update = catchAsync(async (req, res) => {
        const cinema = await cinemaService.update(req.user._id, req.body);

        res.json({
            success: true,
            message: "Cinéma mis à jour",
            data: cinema
        });
    });

    updateHalls = catchAsync(async (req, res) => {
        const { halls } = req.body;
        console.log("updating halls:", halls);
        const cinema = await cinemaService.updateHalls(req.user._id, halls);

        if(! cinema){
            return res.status(404).json({
                success: false,
                message: "Vous n'avez pas de cinéma associé à ce compte",
            });
        }

        console.log("finish updating halls:", cinema.halls);
        res.json({
            success: true,
            message: "Salles mises à jour",
            data: cinema.halls
        });
    });

    updateHours = catchAsync(async (req, res) => {
        const {hours} = req.body;
        const cinema = await cinemaService.updateHours(req.user._id, hours);

        if(! cinema){
            return res.status(404).json({
                success: false,
                message: "Vous n'avez pas de cinéma associé à ce compte",
            });
        }

        res.json({
            success: true,
            message: "Horaires mis à jour",
            data: cinema.openingHours
        });
    });

    delete = catchAsync(async (req, res) => {
        await cinemaService.delete(req.user._id);

        res.json({
            success: true,
            message: "Cinéma supprimé"
        });
    });

    getStats = catchAsync(async (req, res) => {
        const stats = await cinemaService.getStats(req.user._id);

        res.json({
            success: true,
            data: stats
        });
    });

    updateStatus = catchAsync(async (req, res) => {
        const { status } = req.body;
        const cinema = await cinemaService.updateStatus(req.user._id, status);

        res.json({
            success: true,
            message: `Statut mis à jour: ${status}`,
            data: cinema
        });
    });

    deleteById = catchAsync(async (req, res) => {
        await cinemaService.deleteById(req.params.id);

        res.json({
            success: true,
            message: "Cinéma supprimé"
        });
    });

    getHalls = catchAsync(async(req, res) => {
        const cinema = await cinemaService.getByOwner(req.user._id);

        if (! cinema) {
            return res.status(404).json({
                success: false,
                message: "Vous n'avez pas de cinéma associé à ce compte",
            });
        }

        res.json({
            success: true,
            data: cinema.halls
        });
    });

    getHours = catchAsync(async(req, res) => {
        const cinema = await cinemaService.getByOwner(req.user._id);

        if (! cinema) {
            return res.status(404).json({
                success: false,
                message: "Vous n'avez pas de cinéma associé à ce compte",
            });
        }

        res.json({
            success: true,
            data: cinema.openingHours
        });
    });
}

export default new CinemaController();