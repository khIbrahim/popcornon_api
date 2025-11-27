import express from "express";
import publicMoviesController from "../controllers/public_movies.controller.js";

const router = express.Router();

router.get("/", publicMoviesController.getAll);

router.get("/:id", publicMoviesController.getOne);

export default router;
