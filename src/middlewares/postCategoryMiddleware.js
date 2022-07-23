import postCategorySchema from "../schemas/postCategorySchema.js";
import connection from "../dbStrategy/postgres.js";

export async function postcategoryMiddleware(req, res, next) {
  const { name } = req.body;
  const { rows: categories } = await connection.query(
    "SELECT * FROM categories"
  );
  const validation = postCategorySchema.validate(req.body);
  if (validation.error) {
    console.log("O nome da categoria é obrigatório");
    return res.status(400).send("O nome de categoria é obrigatório");
  }

  if (categories.map((c) => c.name === name)) {
    return res.status(409).send("Categoria já existente");
  }
  res.locals.name = name;
  next();
}
