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
const nuevoUsuario = async ( { nombre, apellido, email, password, fecha_muerte } ) => {
  const result = await pool.query({
    text: `INSERT INTO usuarios ( nombre, apellido, email, password, fecha_muerte ) VALUES ( $1, $2, $3, $4, $5 ) RETURNING *`,
    values: [ nombre, apellido, email, password, fecha_muerte ]
  })
  return result.rows[0]
};

//obtener usuarios de la base de datos
const obtenerUsuarios = async () => {
  const result = await pool.query(`SELECT * FROM usuarios`);
  return result.rows;
}

//obtenerUsuarioEmail
const obtenerUsuarioPorEmail = async (email) => {
  const result = await pool.query({
    text: `SELECT * FROM usuarios WHERE email = $1`,
    values: [email]
  })
  return result.rows[0];
}

//Crear Playlist
const nuevaPlaylist = async ( { id_usuario, nombre_playlist } ) => {
  const result = await pool.query({
    text: `INSERT INTO playlists ( id_usuario, nombre_playlist, fecha_creacion ) VALUES ( $1, $2, NOW()) RETURNING *`,
    values: [ id_usuario, nombre_playlist ]
  })
  return result.rows[0]
};

//Editar usuario
const editarUsuario = async (usuario) => {
  const values = Object.values(usuario)
  const result = await pool.query(
    `UPDATE usuarios SET email = '$1', password = '$2', nombre = '$3', apellido = '$4', fecha_muerte = '$5' WHERE id = '$6' RETURNING *`
    , values);
  return result.rows[0];
}


//Obtener Playlists
const obtenerPlaylists = async () => {
  const result = await pool.query(`SELECT * FROM playlists`);
  return result.rows;
}

//obtener playlist por id de usuario
const obtenerPlaylistporIDUsuario = async (id_usuario) => {
  const result = await pool.query({
    text: `SELECT * FROM playlists WHERE id_usuario = $1`,
    values: [id_usuario]
  })
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
  obtenerUsuarioPorEmail,
  editarUsuario,
  nuevaPlaylist,
  obtenerPlaylists,
  obtenerPlaylistporIDUsuario,
  editarPlaylist,
  agregarCancion,
  obtenerCanciones,
  eliminarCancion,
  vaciarPlaylist,
  editarCancion,
  playlistUsuario
}