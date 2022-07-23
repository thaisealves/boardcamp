import gameSchema from "../schemas/gameSchema.js";
import connection from "../dbStrategy/postgres.js";

export async function postGamesMiddleware(req, res, next) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
  const { rows: games } = await connection.query(`SELECT * FROM games`);
  const { rows: categories } = await connection.query(
    `SELECT * FROM categories`
  );
  const validation = gameSchema.validate(req.body);
  if (validation.error || !categories.filter((g) => g.id === categoryId)) {
    console.log(validation.error);
    return res.status(400).send("Não foi possível adicionar este jogo");
  }

  if (games.find((g) => g.name === name)) {
    return res.status(409).send("Jogo já existente");
  }
  res.locals.game = { name, image, stockTotal, categoryId, pricePerDay };
  next();
}
