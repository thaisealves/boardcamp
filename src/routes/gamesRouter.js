import { Router } from "express";
import { postGames, getGames } from "../controllers/gamesController.js";
import { postGamesMiddleware } from "../middlewares/postGamesMiddleware.js";
const router = Router();

router.get("/games", getGames);
router.post("/games", postGamesMiddleware, postGames);
export default router;
