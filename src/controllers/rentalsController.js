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
        `SELECT rentals.*, c.id, c.name, g.id, g.name, g."categoryId", categories.name as "categoryName"  FROM rentals
        JOIN customers c
        ON rentals."customerId" = c.id
        JOIN games g 
        ON rentals."gameId" = g.id
        JOIN categories
        ON games."categoryId" = categories.id
        WHERE "customerId" = $1 ORDER BY id
    `,
        [queryCustomerId]
      );
      res.send(listRentals);
    }
    if (queryGameId) {
      const { rows: listRentals } = await connection.query(
        `SELECT rentals.*, c.id, c.name, g.id, g.name, g."categoryId", categories.name as "categoryName"  FROM rentals
        JOIN customers c
        ON rentals."customerId" = c.id
        JOIN games g 
        ON rentals."gameId" = g.id
        JOIN categories
        ON games."categoryId" = categories.id
        WHERE "gameId" = $1 ORDER BY id
            `,
        [queryGameId]
      );

      res.send(listRentals);
    } else {
      const { rows: listRentals } = await connection.query(
        `SELECT rentals.*, c.id, c.name, g.id, g.name, g."categoryId", categories.name as "categoryName"  FROM rentals
        JOIN customers c
        ON rentals."customerId" = c.id
        JOIN games g 
        ON rentals."gameId" = g.id
        JOIN categories
      ON games."categoryId" = categories.id ORDER BY id`
      );
      res.send(listRentals);
    }
  } catch (error) {
    res.status(500).send("Não foi possível encontrar os aluguéis.");
  }
}

export async function updateRentals(req, res) {}
export async function deleteRentals(req, res) {}
