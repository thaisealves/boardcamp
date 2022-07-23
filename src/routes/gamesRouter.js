import { Router } from "express";
import { postGames, getGames } from "../controllers/gamesController.js";
const router = Router();

router.get("/games", getGames);
router.post("/games", postGames);
export default router;
