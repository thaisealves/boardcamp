import dayjs from "dayjs";
import connection from "../dbStrategy/postgres.js";
export async function postRentals(req, res) {
  const { rental } = res.locals;
  const rentDate = dayjs().format("YYYY-MM-DD");
  const returnDate = null;
  const delayFee = null;
  const { rows: gamePrice } = await connection.query(
    `SELECT "pricePerDay" FROM games WHERE id = $1`,
    [rental.gameId]
  );
  const originalPrice = rental.daysRented * gamePrice[0].pricePerDay;
  try {
    await connection.query(
      `INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
  VALUES ( $1, $2, $3, $4, $5, $6, $7)`,
      [
        rental.customerId,
        rental.gameId,
        rentDate,
        rental.daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function getRentals(req, res) {
  const { customerId: queryCustomerId } = req.query;
  const { gameId: queryGameId } = req.query;
  try {
    if (queryCustomerId) {
      const { rows: listRentals } = await connection.query(
        `SELECT rentals.*, json_build_object('id', c.id, 'name', c.name ) AS "customer", 
        json_build_object('id', g.id, 'name', g.name, 'categoryId', g."categoryId", 'categoryName', categories.name ) AS "game"
        FROM rentals 
        JOIN games g ON rentals."gameId"= g.id
        JOIN categories ON g."categoryId" = categories.id
        JOIN customers c ON rentals."customerId"= c.id
        WHERE "customerId" = $1  ORDER BY rentals.id
    `,
        [Number(queryCustomerId)]
      );
      return res.send(listRentals);
    } else if (queryGameId) {
      const { rows: listRentals } = await connection.query(
        `SELECT rentals.*, json_build_object('id', c.id, 'name', c.name ) AS "customer", 
        json_build_object('id', g.id, 'name', g.name, 'categoryId', g."categoryId", 'categoryName', categories.name ) AS "game"
        FROM rentals 
        JOIN games g ON rentals."gameId"= g.id
        JOIN categories ON g."categoryId" = categories.id
        JOIN customers c ON rentals."customerId"= c.id
        WHERE "gameId" = $1  ORDER BY rentals.id
            `,
        [queryGameId]
      );

      return res.send(listRentals);
    } else {
      const { rows: listRentals } = await connection.query(
        `SELECT rentals.*, json_build_object('id', c.id, 'name', c.name ) AS "customer", 
        json_build_object('id', g.id, 'name', g.name, 'categoryId', g."categoryId", 'categoryName', categories.name ) AS "game"
        FROM rentals 
        JOIN games g ON rentals."gameId"= g.id
        JOIN categories ON g."categoryId" = categories.id
        JOIN customers c ON rentals."customerId"= c.id
        ORDER BY rentals.id
        `
      );
      return res.send(listRentals);
    }
  } catch (error) {
    res.status(500).send("Não foi possível encontrar os aluguéis.");
  }
}

export async function endRental(req, res) {
  const { id } = req.params;
  const newReturnDate = dayjs().format("YYYY-MM-DD");
  let newDelayFee = null;
  const { rows: idGame } = await connection.query(
    `SELECT games."pricePerDay", rentals.* FROM games 
  JOIN rentals ON games.id = rentals."gameId"
  WHERE rentals.id = $1`,
    [id]
  );
  const returnExpected = dayjs(idGame[0].rentDate).add(
    idGame[0].daysRented,
    "days"
  );
  const delay = dayjs().diff(returnExpected, "d");

  if (delay > 0) {
    newDelayFee = idGame[0].pricePerDay * delay;
  }
  try {
    await connection.query(
      `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = ${id}`,
      [newReturnDate, newDelayFee]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function deleteRentals(req, res) {}
