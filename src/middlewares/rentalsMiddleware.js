import connection from "../dbStrategy/postgres.js";
import rentalsSchema from "../schemas/rentalsSchema.js";

export async function rentalsMiddleware(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;
  const { rows: games } = await connection.query(`SELECT * FROM games`);
  const { rows: customers } = await connection.query(`SELECT * FROM customers`);

  const validation = rentalsSchema.validate(req.body);
  if (
    validation.error ||
    !customers.find((c) => c.id === customerId) ||
    !games.find((g) => g.id === gameId) ||
    (await getRentals(gameId))
  ) {
    console.log(await getRentals(gameId));
    console.log(!games.find((g) => g.id === gameId));
    console.log(!customers.find((c) => c.id === customerId));
    console.log(validation.error);
    return res.status(400).send("Não foi possível adicionar este aluguel");
  }

  res.locals.rental = { customerId, gameId, daysRented };
  next();
}

async function getRentals(gameId) {
  const { rows: rentalsList } = await connection.query(
    `SELECT rentals.id, games."stockTotal" FROM rentals 
    JOIN games 
    ON rentals."gameId" = games.id  
    WHERE rentals."returnDate" IS NULL AND rentals."gameId" = $1`,
    [gameId]
  );
  console.log(rentalsList);
  if (
    rentalsList.length > 0 &&
    rentalsList.length >= rentalsList[0].stockTotal
  ) {
    return true;
  }
  return false;
}
