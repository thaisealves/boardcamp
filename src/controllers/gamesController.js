import connection from "../dbStrategy/postgres.js";

export async function postGames(req, res) {}
export async function getGames(req, res) {
  const { name: queryName } = req.query;
  let query;
  try {
    
    if (queryName) {
      const lowerCaseQueryName = queryName.toLowerCase() + "%";
      console.log(lowerCaseQueryName)
      query = `SELECT games.*, categories.name as "categoryName" FROM games  
      JOIN categories
      ON games."categoryId" = categories.id
      WHERE games.name = ${lowerCaseQueryName}
      `;
    } else {
      query = `SELECT games.*, categories.name as "categoryName" FROM games  
      JOIN categories
      ON games."categoryId" = categories.id`;
    }
    console.log(query)
    const { rows: listGames } = await connection.query(query);
    res.send(listGames);
  }
  catch(error){
    res.status(500).send("Não foi possível encontraros jogos ")
  }
}
