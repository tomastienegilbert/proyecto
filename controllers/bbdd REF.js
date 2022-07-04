const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgresql",
  database: "proyecto",
  port: 5432,
});



// Transacción de creación de nuevo user y posteriormente nueva playlist
// Transacción de creación de nuevo user y posteriormente nueva playlist
const newUser = async (user) => {
  const values = Object.values(user)
  const result = await pool.query(
    // `INSERT INTO users ( email , password , nombre , apellido , fecha_muerte ) values ($1, $2, $3, $4, $5 ) RETURNING *`
    `BEGIN TRANSACTION;
    INSERT INTO users ( email , password , nombre , apellido , fecha_muerte ) values ($1, $2, $3, $4, $5 );
    INSERT INTO playlists ( nombre_playlist , id_usuario , fecha_creacion ) values ('Playlist de ${user.nombre}', $7, now());
    COMMIT;`
    , values);
  return result.rows[0];
}

// // crear nuevo usuario
// const newUser = async (user) => {
//   const values = Object.values(user)
//   const result = await pool.query(
//     `INSERT INTO users ( email , password , nombre , apellido , fecha_muerte ) values ($1, $2, $3, $4, $5 ) RETURNING *`
//     , values);
//   return result.rows[0];
// }

// //crear nueva playlist
// const newPlaylist = async (playlist) => {
//   const values = Object.values(playlist)
//   const result = await pool.query(
//     `INSERT INTO playlists ( nombre_playlist , id_usuario , fecha_creacion ) values ($1, $2, $3, $4, $5 ) RETURNING *`
//     , values);
//   return result.rows[0];
// }

const updateUser = async (user) => {
  const values = Object.values(user)
  const result = await pool.query(
    `UPDATE users SET  email = $1, password = $2 , nombre = $3, apellido = $3 , fecha_muerte = $4   RETURNING *`
    , values);
  return result.rows[0];
}

const getUsers = async () => {
  const result = await pool.query(
    `SELECT * FROM users`
  );
  return result.rows;
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

const getPlaylist = async (id_playlist) => {
  const result = await pool.query(
    `SELECT * FROM skaters WHERE id_playlist = '${id_playlist}'`
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

const deletePlaylist = async (id) => {
  const result = await pool.query(
    `DROP TABLE playlist WHERE id = ${id} RETURNING *`
  );
  const playlist = result.rows[0];
  return playlist;
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
  // newPlaylist,
  getCanciones,
  getSkater,
  getUsers,
  getPlaylist,
  setSkaterStatus,
  updateUser,
  deleteSkater,
  deletePlaylist
};
