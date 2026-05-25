import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getExercises } from "../controllers/exercise.controller.js";

const router = Router();

router.use(verifyToken);

router.get("/", getExercises);

export default router;
