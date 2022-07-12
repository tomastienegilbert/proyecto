const { query } = require("express");
const { Pool, Query } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "postgresql",
  database: "proyecto",
  port: 5432,
});

// crear nuevo usuario
const nuevoUsuario = async (usuario) => {
  const values = Object.values(usuario)
  const result = await pool.query(
  `INSERT INTO usuarios ( email, password, nombre, apellido, fecha_muerte ) values ($1, $2, $3, $4, $5) RETURNING *`,
  values);
  return result.rows[0]
}

//obtener usuarios de la base de datos
const obtenerUsuarios = async () => {
  const result = await pool.query(`SELECT * FROM usuarios`);
  return result.rows;
}

//Editar usuario
const editarUsuario = async (usuario) => {
  const values = Object.values(usuario)
  const result = await pool.query(
    `UPDATE usuarios SET email = '$1', password = '$2', nombre = '$3', apellido = '$4', fecha_muerte = '$5' WHERE id = '$6' RETURNING *`
    , values);
  return result.rows[0];
}

//Crear Playlist
const nuevaPlaylist = async (playlist) => {
  // const usuarioPlaylist = encontrar metodo que indique el id del usuario correspondiente
  const values = Object.values(playlist)
  const result = await pool.query(
    `INSERT INTO playlists ( nombre_playlist, id_usuario, fecha_creacion ) values ($1, $2, NOW()) RETURNING *`
    , values);
  return result.rows[0];
}

//Obtener Playlists
const obtenerPlaylists = async () => {
  const result = await pool.query(`SELECT * FROM playlists`);
  return result.rows;
}

//Editar Playlist
const editarPlaylist = async (playlist) => {
  const values = Object.values(playlist)
  const result = await pool.query(
    `UPDATE playlist SET nombre_playlist = $1 WHERE id = $2 RETURNING *`
    , values);
  return result.rows[0];
}

//Agregar canciones a una playlists
const agregarCancion = async (playlist) => {
  const values = Object.values(playlist)
  const result = await pool.query(
    `INSERT INTO canciones ( titulo, album, artista, comentario, enlace, id_playlist ) values ($1, $2, $3, $4, $5, $6) RETURNING *`
    , values);
  return result.rows[0];
}

//Obtener Canciones
const obtenerCanciones = async () => {
  const result = await pool.query(`SELECT * FROM canciones`);
  return result.rows;
}

//eliminar cancion
const eliminarCancion = async (cancion) => {
  const values = Object.values(cancion)
  const result = await pool.query(
    `DELETE FROM canciones WHERE id = $1 RETURNING *`
    , values);
  return result.rows[0];
}

//eliminar todas las canciones de una playlist
const vaciarPlaylist = async (canciones) => {
  const values = Object.values(canciones)
  const result = await pool.query(
    `DELETE FROM canciones WHERE id_playlist = $1 RETURNING *`
    , values);
  return result.rows[0];
}

//editar cancion
const editarCancion = async (cancion) => {
  const values = Object.values(cancion)
  const result = await pool.query(
    `UPDATE canciones SET titulo = $1, album = $2, artista = $3, comentario = $4, enlace = $5 WHERE id = $6 RETURNING *`
    , values);
  return result.rows[0];
}

//Obtener playlist de un usuario
const playlistUsuario = async (canciones) => {
  const values = Object.values(canciones)
  const result = await pool.query(
    `SELECT * FROM canciones WHERE id_playlist = $1`
    , values);
  return result.rows;
}



module.exports = {
  nuevoUsuario,
  obtenerUsuarios,
  editarUsuario,
  nuevaPlaylist,
  obtenerPlaylists,
  editarPlaylist,
  agregarCancion,
  obtenerCanciones,
  eliminarCancion,
  vaciarPlaylist,
  editarCancion,
  playlistUsuario
}