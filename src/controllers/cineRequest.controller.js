import catchAsync from "../utils/catchAsync.js";
import cineRequestService from "../services/cineRequest.service.js";
import cinemaService from "../services/cinema.service.js";

class CineRequestController {

    create = catchAsync(async (req, res) => {
        const request = await cineRequestService.create(req.user._id, req.body);

        res.status(201).json({
            success: true,
            message: "Demande envoyée avec succès",
            data: request
        });
    });

    me = catchAsync(async (req, res) => {
        const cinema = await cinemaService.getByOwner(req.user._id);
        if (cinema) {
            return res.json({
                success: true,
                status: "cinema",
                data: cinema
            });
        }

        const request = await cineRequestService.getMyRequest(req.user._id);
        if (request) {
            return res.json({
                success: true,
                status: request.status,
                data: request
            });
        }

        return res.json({
            success: true,
            status: "none",
            data: null
        });
    });

    getAll = catchAsync(async (req, res) => {
        const { status } = req.query;

        const requests = await cineRequestService.getAll(status);

        res.json({
            success: true,
            count: requests.length,
            data: requests
        });
    });

    review = catchAsync(async (req, res) => {
        const { status, adminNote } = req.body;

        const request = await cineRequestService.review(
            req.params.id,
            req.user._id,
            status,
            adminNote
        );

        res.json({
            success: true,
            message: status === "approved"
                ? "Demande approuvée avec succès"
                : "Demande rejetée",
            data: request
        });
    });

}

export default new CineRequestController();