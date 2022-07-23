import connection from "../dbStrategy/postgres.js";

export async function postCategories(req, res) {
  const { name } = res.locals;

  await connection.query(`INSERT INTO categories (name) VALUES ('${name}')`);

  res.sendStatus(201);
}
export async function getCategories(req, res) {
  const { rows: categories } = await connection.query(
    "SELECT * FROM categories"
  );

  res.send(categories);
}
