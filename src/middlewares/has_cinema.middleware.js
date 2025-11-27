import catchAsync from "../utils/catchAsync.js";
import cinemaService from "../services/cinema.service.js";

export const HasCinema = catchAsync(async (req, res, next) => {
    const user = req.user;

    const cinema = await cinemaService.getByOwner(user._id);
    if(cinema == null) {
        return res.status(403).json({
            success: false,
            message: "Vous devez posséder un cinéma pour effectuer cette action."
        });
    }

    next();
});