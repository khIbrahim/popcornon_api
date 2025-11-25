import express from 'express';
import {validate} from "../middlewares/validations.js";
import cinemaController from "../controllers/cinema.controller.js";
import {CheckAuth} from "../middlewares/auth.middleware.js";
import {CheckRole} from "../middlewares/auth_role.middleware.js";
import {createCinemaSchema, updateCinemaSchema} from "../schemas/cinema.schema.js";

const router = express.Router();

router.use(CheckAuth)
router.use(CheckRole('cine', 'admin'))

router.get(
    '/me',
    cinemaController.me
);

router.post(
    '/',
    validate(createCinemaSchema),
    cinemaController.create
);

router.patch(
    '/',
    validate(updateCinemaSchema),
    cinemaController.update
);

router.delete(
    '/',
    cinemaController.delete
)

export default router;