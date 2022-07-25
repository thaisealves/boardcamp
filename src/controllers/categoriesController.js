import connection from "../dbStrategy/postgres.js";

export async function postCategories(req, res) {
  const { categoryName } = res.locals;

  await connection.query(
    `INSERT INTO categories (name) VALUES ('${categoryName}')`
  );

  res.sendStatus(201);
}
export async function getCategories(req, res) {
  const { offset: queryOffset } = req.query;
  const { limit: queryLimit } = req.query;
  if (queryLimit && queryOffset) {
    const { rows: listCategories } = await connection.query(
      `SELECT * FROM categories ORDER BY id LIMIT $1 OFFSET $2
          `,
      [Number(queryLimit), Number(queryOffset)]
    );

    return res.send(listCategories);
  } else if (queryOffset) {
    const { rows: listCategories } = await connection.query(
      `SELECT * FROM categories ORDER BY id OFFSET $1
          `,
      [Number(queryOffset)]
    );

    return res.send(listCategories);
  } else if (queryLimit) {
    const { rows: listCategories } = await connection.query(
      `SELECT * FROM categories ORDER BY id LIMIT $1
          `,
      [Number(queryLimit)]
    );

    return res.send(listCategories);
  } else {
    const { rows: categories } = await connection.query(
      "SELECT * FROM categories ORDER BY id"
    );
    return res.send(categories);
  }
}
