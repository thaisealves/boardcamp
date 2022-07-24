import connection from "../dbStrategy/postgres.js";

export async function postCustomers(req, res) {
  const { customer } = res.locals;
  try {
    await connection.query(
      `INSERT INTO customers (name, phone, cpf, birthday)
  VALUES ( $1, $2, $3, $4)`,
      [customer.name, customer.phone, customer.cpf, customer.birthday]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function getCustomers(req, res) {}
export async function getCustomersById(req, res) {}
export async function putCustomers(req, res) {}
