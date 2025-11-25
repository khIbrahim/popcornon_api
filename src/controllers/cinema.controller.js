import catchAsync from "../utils/catchAsync.js";
import cinemaService from "../services/cinema.service.js";

class CinemaController {
    me = catchAsync(async (req, res) => {
        const cinema = cinemaService.getByOwner(req.user._id);
        if(! cinema) {
            return res.status(404).json({
                success: false,
                message: "Vous n'avez pas de cinéma associé à ce compte",
            });
        }

        return res.status(200).json({
            success: true,
            data: cinema
        })
    })

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

    delete = catchAsync(async (req, res) => {
        await cinemaService.delete(req.user._id);

        res.json({
            success: true,
            message: "Cinéma supprimé"
        });
    });

}

export default new CinemaController();