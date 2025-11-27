import express from "express";
import { validate } from "../middlewares/validations.js"
import {registerSchema, loginSchema, updateSchema, updatePasswordSchema, resetPasswordSchema} from "../schemas/auth.schema.js";
import authController from "../controllers/auth.controller.js";
import {CheckAuth} from "../middlewares/auth.middleware.js";
import { z } from "zod";
import {CheckRole} from "../middlewares/auth_role.middleware.js";

const router = express.Router();

router.post(
    '/register',
    validate(registerSchema),
    authController.register
)

router.post(
    '/login',
    validate(loginSchema),
    authController.login
)

router.post(
    '/logout',
    CheckAuth,
    authController.logout
)

router.get(
    '/me',
    CheckAuth,
    authController.me
)

router.patch(
    '/update',
    validate(updateSchema),
    CheckAuth,
    authController.update
)

router.patch(
    '/update-password',
    validate(updatePasswordSchema),
    CheckAuth,
    authController.updatePassword
)

router.post(
    '/forgot-password',
    validate(z.object({
        body: z.object({email: z.string().email({message: "Invalid email address"})})
    })),
    authController.forgotPassword
)

router.patch(
    '/reset-password/:token',
    validate(resetPasswordSchema),
    authController.resetPassword
)

router.delete(
    '/delete/:id',
    CheckAuth,
    CheckRole('admin'),
    authController.delete
)

export default router;