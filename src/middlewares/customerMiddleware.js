import customerSchema from "../schemas/customerSchema.js";
import connection from "../dbStrategy/postgres.js";

export async function postCustomerMiddleware(req, res, next) {
  const { name, phone, cpf, birthday } = req.body;
  const { rows: customers } = await connection.query(`SELECT * FROM customers`);

  const validation = customerSchema.validate(req.body);
  if (validation.error) {
    console.log(validation.error);
    return res.status(400).send("Dados incorretos para adicionar cliente");
  }

  if (customers.find((g) => g.cpf === cpf)) {
    return res.status(409).send("CPF já cadastrado");
  }
  res.locals.customer = { name, phone, cpf, birthday };
  next();
}
export async function putCustomerMiddleware(req, res, next) {
  const { name, phone, cpf, birthday } = req.body;
  const { id } = req.params;
  const { rows: customers } = await connection.query(`SELECT * FROM customers`);

  const validation = customerSchema.validate(req.body);
  if (validation.error) {
    console.log(validation.error);
    return res.status(400).send("Dados incorretos para adicionar cliente");
  }

  if (customers.find((g) => g.cpf === cpf)) {
    const { rows: idCostumer } = await connection.query(
      `SELECT * FROM customers WHERE cpf=$1 ORDER BY id`,
      [cpf]
    );
    if (idCostumer[0].id !== Number(id)) {
      return res
        .status(409)
        .send("CPF já cadastrado, e não relacionado ao usuário do id");
    }
  }
  res.locals.customer = { name, phone, cpf, birthday };
  next();
}
