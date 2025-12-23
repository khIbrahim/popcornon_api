import catchAsync from "../utils/catchAsync.js";
import cinemaService from "../services/cinema.service.js";

class CinemaController {
    me = catchAsync(async (req, res) => {
        const cinema = await cinemaService.getByOwner(req.user._id);

        if (! cinema) {
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

    updateStatus = catchAsync(async (req, res) => {
        const { status } = req.body;
        const cinema = await cinemaService.updateStatus(req.user._id, status);

        res.json({
            success: true,
            message: `Statut mis à jour: ${status}`,
            data: cinema
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

    updateLocation = catchAsync(async(req, res) => {
        let cinema = await cinemaService.getByOwner(req.user._id);

        if (! cinema) {
            return res.status(404).json({
                success: false,
                message: "Vous n'avez pas de cinéma associé à ce compte",
            });
        }

        cinema = await cinemaService.updateLocation(cinema._id, req.body.location);

        res.json({
            success: true,
            message: "Localisation mise à jour",
            data: cinema.location
        });
    })

    updateImage = catchAsync(async(req, res) => {
        if(! req.photo || ! req.cover){
            return res.status(400).json({
                success: false,
                message: "Photo ou photo de couverture manquante",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Images mises à jour",
            data: {
                photo: req.photo,
                coverPhoto: req.cover
            }
        })
    })
}

export default new CinemaController();