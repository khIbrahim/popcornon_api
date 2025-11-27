import { validate } from "../middlewares/validations.js"
import express from "express";
import {CheckAuth} from "../middlewares/auth.middleware.js";
import {createMovieSchema, updateMovieSchema} from "../schemas/movie.schema.js";
import movieController from "../controllers/movie.controller.js";
import {CheckRole} from "../middlewares/auth_role.middleware.js";
import {HasCinema} from "../middlewares/has_cinema.middleware.js";

const router = express.Router();

router.post(
    "/",
    CheckAuth,
    CheckRole('cine', 'admin'),
    HasCinema,
    validate(createMovieSchema),
    movieController.create
);

router.get(
    '/:id',
    CheckAuth,
    CheckRole('admin'),
    movieController.getByCinema
)

router.get(
    "/",
    CheckAuth,
    CheckRole('cine', 'admin'),
    HasCinema,
    movieController.getMyMovies
);

router.patch(
    "/:id",
    CheckAuth,
    CheckRole('cine', 'admin'),
    HasCinema,
    validate(updateMovieSchema),
    movieController.update
)

router.delete(
    "/:id",
    CheckAuth,
    CheckRole('cine', 'admin'),
    HasCinema,
    movieController.delete
)

router.post(
    "/archive-expired",
    CheckAuth,
    CheckRole("cine", "admin"),
    movieController.archiveExpired
);

export default router;