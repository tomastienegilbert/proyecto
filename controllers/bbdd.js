const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgresql",
  database: "proyecto",
  port: 5432,
});

const newUser = async (user) => {
  const values = Object.values(user)
  const result = await pool.query(
    `INSERT INTO users ( email , password , nombre , apellido , fecha_muerte ) values ($1, $2, $3, $4, $5 ) RETURNING *`
    , values);
  return result.rows[0];
}

const updateUser = async (user) => {
  const values = Object.values(user)
  const result = await pool.query(
    `UPDATE users SET  email = $1, password = $2 , nombre = $3, apellido = $3 , fecha_muerte = $4   RETURNING *`
    , values);
  return result.rows[0];
}


const getCanciones = async () => {
  const result = await pool.query(`SELECT * FROM canciones WHERE id_playlist = 1`);
  return result.rows;
}

const getSkater = async (email, password) => {
  const result = await pool.query(
    `SELECT * FROM skaters WHERE email = '${email}' AND password = '${password}'`
  );

  return result.rows[0];
}

const setSkaterStatus = async (id, estado) => {
  const result = await pool.query(
    `UPDATE skaters SET estado = ${estado} WHERE id = ${id} RETURNING *`
  );
  const skater = result.rows[0];
  return skater;
}

const deleteSkater = async (id) => {
  const result = await pool.query(
    `DELETE FROM skaters WHERE id = ${id} RETURNING *`
  );
  const skater = result.rows[0];
  return skater;
}


module.exports = {
  newUser,
  getCanciones,
  getSkater,
  setSkaterStatus,
  updateUser,
  deleteSkater
};
