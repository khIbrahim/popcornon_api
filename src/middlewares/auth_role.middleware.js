import catchAsync from "../utils/catchAsync.js";
import {UnauthorizedError} from "../utils/errors.js";

export const CheckRole = (...allowedRoles) => {
    return catchAsync(async (req, res, next) => {
        const user = req.user;

        if(! allowedRoles.includes(user.role)){
            return next(new UnauthorizedError("You do not have permission to perform this action."));
        }

        next();
    });
}