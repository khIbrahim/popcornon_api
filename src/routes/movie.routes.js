import { validate } from "../middlewares/validations.js"
import express from "express";
import {CheckAuth} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(CheckAuth);

router.post(
    "/",
    validate(createMovieSchema)
)