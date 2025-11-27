import express from 'express';
import {validate} from "../middlewares/validations.js";
import cinemaController from "../controllers/cinema.controller.js";
import {CheckAuth} from "../middlewares/auth.middleware.js";
import {CheckRole} from "../middlewares/auth_role.middleware.js";
import {
    createCinemaSchema,
    updateCinemaSchema,
    updateHallsSchema,
    updateHoursSchema
} from "../schemas/cinema.schema.js";
import {z} from "zod";

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
);

router.get(
    '/halls',
    cinemaController.getHalls
);

router.put(
    '/halls',
    validate(updateHallsSchema),
    cinemaController.updateHalls
)

router.get(
    '/opening-hours',
    cinemaController.getHours
)

router.put(
    '/opening-hours',
    validate(updateHoursSchema),
    cinemaController.updateHours
)

router.patch(
    '/status',
    validate(z.object({
        body: z.object({
            status: z.enum(["active", "pending", "suspended"])
        })
    })),
    cinemaController.updateStatus
)

export default router;