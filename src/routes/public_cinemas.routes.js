import express from "express";
import publicCinemasController from "../controllers/public_cinemas.controller.js";

const router = express.Router();

router.get("/", publicCinemasController.getAll);

router.get("/search", publicCinemasController.search);

router.get("/cinema/:name", publicCinemasController.getByName);

router.get("/:id", publicCinemasController.getOne);

export default router;
