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
export async function getCustomers(req, res) {
  const { cpf: queryCpf } = req.query;
  const { offset: queryOffset } = req.query;
  const { limit: queryLimit } = req.query;

  let query;
  try {
    if (queryCpf) {
      const likeCpf = queryCpf + "%";
      query = `SELECT * FROM customers
      WHERE cpf LIKE '${likeCpf}' ORDER BY id
      `;
    } else if (queryLimit && queryOffset) {
      const { rows: listRentals } = await connection.query(
        `SELECT * FROM customers ORDER BY id LIMIT $1 OFFSET $2
            `,
        [Number(queryLimit), Number(queryOffset)]
      );

      return res.send(listRentals);
    } else if (queryOffset) {
      const { rows: listRentals } = await connection.query(
        `SELECT * FROM customers ORDER BY id OFFSET $1
            `,
        [Number(queryOffset)]
      );

      return res.send(listRentals);
    } else if (queryLimit) {
      const { rows: listRentals } = await connection.query(
        `SELECT * FROM customers ORDER BY id LIMIT $1
            `,
        [Number(queryLimit)]
      );

      return res.send(listRentals);
    } else {
      query = `SELECT * FROM customers ORDER BY id`;
    }
    const { rows: listCostumers } = await connection.query(query);
    res.send(listCostumers);
  } catch (error) {
    res.status(500).send("Não foi possível encontrar os clientes.");
  }
}
export async function getCustomersById(req, res) {
  const { id } = req.params;

  try {
    const { rows: idCostumer } = await connection.query(
      `SELECT * FROM customers WHERE id=${id}`
    );

    if (idCostumer.length === 0) {
      return res.status(404).send("Cliente não existe");
    } else {
      return res.send(idCostumer[0]);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function putCustomers(req, res) {
  const { customer } = res.locals;
  const { id } = req.params;

  try {
    await connection.query(
      `UPDATE customers SET name = $1, phone = $2, cpf = $3, birthday = $4
    WHERE id = ${id}`,
      [customer.name, customer.phone, customer.cpf, customer.birthday]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
