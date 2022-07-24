import connection from "../dbStrategy/postgres.js";

export async function postGames(req, res) {
  const { game } = res.locals;
  try {
    await connection.query(
      `INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
  VALUES ( $1, $2, $3, $4, $5)`,
      [
        game.name,
        game.image,
        game.stockTotal,
        game.categoryId,
        game.pricePerDay,
      ]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getGames(req, res) {
  const { name: queryName } = req.query;

  let query;
  try {
    if (queryName) {
      const lowerCaseQueryName = queryName.toLowerCase() + "%";
      query = `SELECT games.*, categories.name as "categoryName" FROM games
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE LOWER(games.name) LIKE '${lowerCaseQueryName}' ORDER BY id
      `;
    } else {
      query = `SELECT games.*, categories.name as "categoryName" FROM games
      JOIN categories
      ON games."categoryId" = categories.id ORDER BY id`;
    }
    const { rows: listGames } = await connection.query(query);
    res.send(listGames);
  } catch (error) {
    res.status(500).send("Não foi possível encontrar os jogos");
  }
}
