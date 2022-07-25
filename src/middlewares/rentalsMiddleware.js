import connection from "../dbStrategy/postgres.js";
import rentalsSchema from "../schemas/rentalsSchema.js";
export async function postRentalsMiddleware(req, res, next) {
  const { customerId, gameId, daysRented } = req.body;
  const { rows: games } = await connection.query(`SELECT * FROM games`);
  const { rows: customers } = await connection.query(`SELECT * FROM customers`);

  const validation = rentalsSchema.validate(req.body);
  if (
    validation.error ||
    !customers.find((c) => c.id === customerId) ||
    !games.find((g) => g.id === gameId) ||
    (await possibleRentals(gameId))
  ) {
    console.log(await possibleRentals(gameId));
    console.log(!games.find((g) => g.id === gameId));
    console.log(!customers.find((c) => c.id === customerId));
    console.log(validation.error);
    return res.status(400).send("Não foi possível adicionar este aluguel");
  }

  res.locals.rental = { customerId, gameId, daysRented };
  next();
}

async function possibleRentals(gameId) {
  const { rows: rentalsList } = await connection.query(
    `SELECT rentals.id, games."stockTotal" FROM rentals 
    JOIN games 
    ON rentals."gameId" = games.id  
    WHERE rentals."returnDate" IS NULL AND rentals."gameId" = $1`,
    [gameId]
  );
  if (
    rentalsList.length > 0 &&
    rentalsList.length >= rentalsList[0].stockTotal
  ) {
    return true;
  }
  return false;
}

export async function updateRentalMiddleware(req, res, next) {
  const { id } = req.params;
  const { rows: rentals } = await connection.query(
    `SELECT * FROM rentals WHERE id = $1`,
    [id]
  );
  if (!rentals.find((r) => r.id === Number(id))) {
    return res.status(404).send("Esse aluguel não existe");
  }

  if (rentals[0].returnDate !== null) {
    return res.status(400).send("Aluguel já finalizado");
  }

  next();
}

export async function deleteRentalMiddleware(req, res, next) {
  const { id } = req.params;
  const { rows: rentals } = await connection.query(
    `SELECT * FROM rentals WHERE id = $1`,
    [id]
  );
  if (rentals.length === 0) {
    return res.status(404).send("ID não corresponde a algum aluguel");
  }
  if (rentals[0].returnDate === null) {
    return res.status(400).send("Aluguel ainda não finalizado.");
  }
  next();
}
