import express from "express";
import { validate } from "../middlewares/validations.js";
import { CheckAuth } from "../middlewares/auth.middleware.js";
import cineRequestController from "../controllers/cineRequest.controller.js";
import { createRequestSchema } from "../schemas/cineRequest.schema.js";
import {CheckRole} from "../middlewares/auth_role.middleware.js";

const router = express.Router();

router.use(CheckAuth);

router.post(
    '/',
    validate(createRequestSchema),
    cineRequestController.create
);

router.get(
    '/me',
    cineRequestController.me
);

router.get(
    '/',
    CheckRole('admin'),
    cineRequestController.getAll
);

router.patch(
    '/:id/review',
    CheckRole('admin'),
    cineRequestController.review
);

export default router;