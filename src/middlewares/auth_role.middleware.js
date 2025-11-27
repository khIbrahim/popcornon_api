import catchAsync from "../utils/catchAsync.js";
import {UnauthorizedError} from "../utils/errors.js";

export const CheckRole = (...allowedRoles) => {
    return catchAsync(async (req, res, next) => {
        const user = req.user;

        if(! allowedRoles.includes(user.role)){
            return next(new UnauthorizedError("Vous n'avez pas la permission d'effectuer cette action."));
        }

        next();
    });
}