const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgresql",
  database: "proyecto",
  port: 5432,
});

// crear nuevo usuario
const nuevoUsuario = async (user) => {
  const values = Object.values(user)
  const result = await pool.query(
    `INSERT INTO users ( email , password , nombre , apellido , fecha_muerte ) values ($1, $2, $3, $4, $5 ) RETURNING *`
    , values);
  return result.rows[0];
}

//obtener usuarios de la base de datos
const obtenerUsuarios = async () => {
  const result = await pool.query(`SELECT * FROM users`);
  return result.rows;
}

//Editar usuario
const editarUsuario = async (user) => {
  const values = Object.values(user)
  const result = await pool.query(
    `UPDATE users SET email = $1, password = $2, nombre = $3, apellido = $4, fecha_muerte = $5 WHERE id = $6 RETURNING *`
    , values);
  return result.rows[0];
}

//Crear Playlist
const nuevaPlaylist = async (playlist) => {
  // const usuarioPlaylist = encontrar metodo que indique el id del usuario correspondiente
  const values = Object.values(playlist)
  const result = await pool.query(
    `INSERT INTO playlist ( nombre_playlist , id_usuario , fecha_creacion ) values ($1, $2, NOW()) RETURNING *`
    , values);
  return result.rows[0];
}

const obtenerPlaylists = async () => {
  const result = await pool.query(`SELECT * FROM playlist`);
  return result.rows;
}

const editarPlaylist = async (playlist) => {
  const values = Object.values(playlist)
  const result = await pool.query(
    `UPDATE playlist SET nombre_playlist = $1 WHERE id = $4 RETURNING *`
    , values);
  return result.rows[0];
}

modules.exports = {
  nuevoUsuario,
  obtenerUsuarios,
  editarUsuario,
  nuevaPlaylist
}