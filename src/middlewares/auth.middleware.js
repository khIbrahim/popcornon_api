import catchAsync from "../utils/catchAsync.js";
import {UnauthorizedError} from "../utils/errors.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import User from "../models/user.model.js";

export const CheckAuth = catchAsync(async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies && req.cookies.jwt){
        token = req.cookies.jwt;
    }

    if(! token) {
        return next(new UnauthorizedError("You are not logged in! Please log in to get access."));
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    if(! currentUser) {
        return next(new UnauthorizedError("The user belonging to this token does no longer exist."));
    }

    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new UnauthorizedError("User recently changed password! Please log in again."));
    }

    req.user = currentUser;
    next();
})