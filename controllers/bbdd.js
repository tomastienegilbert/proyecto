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

//obtener playlist por id de usuario
const obtenerPlaylistporIDUsuario = async (id_usuario) => {
  const result = await pool.query({
    text: `SELECT * FROM playlists WHERE id_usuario = $1`,
    values: [id_usuario]
  })
  return result.rows[0];
}

//obtener playlist por id
const obtenerPlaylistPorID = async (id_playlist) => {
  const result = await pool.query({
    text: `SELECT * FROM playlists WHERE id_playlist = $1`,
    values: [id_playlist]
  })
  return result.rows[0];
}


//Editar usuario
const editarUsuario = async ({nombre, apellido, email, password, fecha_muerte}, id_usuario) => {
  const values = Object.values({nombre, apellido, email, password, fecha_muerte}, id_usuario)
  const result = await pool.query({
    text: `UPDATE usuarios SET nombre = $1, apellido = $2, email = $3, password = $4, fecha_muerte = $5 WHERE id_usuario = $6 RETURNING *`,
    values: [ usuario.nombre, usuario.apellido, usuario.email, usuario.password, usuario.fecha_muerte, usuario.id_usuario ]
  })
  return result.rows[0]
}




//Editar Playlist
const editarPlaylist = async (playlist) => {
  const values = Object.values(playlist)
  const result = await pool.query(
    `UPDATE playlist SET nombre_playlist = $1 WHERE id = $2 RETURNING *`
    , values);
  return result.rows[0];
}

//Agregar canciones a una playlist con determinnado id_playlist
const agregarCancion = async ({titulo, album, artista, comentario, enlace, id_playlist}) => {
  const result = await pool.query({
    text: `INSERT INTO canciones ( titulo, album, artista, comentario, enlace, id_playlist ) VALUES ( $1, $2, $3, $4, $5, $6 ) RETURNING *`,
    values: [ titulo, album, artista, comentario, enlace, id_playlist ]
  })
  return result.rows[0]
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
    `DELETE FROM canciones WHERE id_cancion = $1 RETURNING *`
    , values);
  return result.rows[0];
}

//eliminar todas las canciones de una playlist
const vaciarPlaylist = async (id_playlist) => {
 const values = Object.values(id_playlist)
  const result = await pool.query({
    text: `DELETE FROM canciones WHERE id_playlist = $1 RETURNING *`,
    values: [id_playlist]
  })
  return result.rows[0];
}

//editar cancion
const actualizarCancion = async ({titulo, album, artista, comentario, enlace}, id_cancion) => {
  const values = Object.values({titulo, album, artista, comentario, enlace}, id_cancion)
  const result = await pool.query({
    text: `UPDATE canciones SET titulo = $1, album = $2, artista = $3, comentario = $4, enlace = $5 WHERE id_cancion = $6 RETURNING *`,
    values: [ titulo, album, artista, comentario, enlace, id_cancion ]
  })
  return result.rows[0];
}

//Obtener playlist de determinada playlist
const obtenerCancionesPorIDPlaylist = async (id_playlist) => {
  const result = await pool.query({
    text: `SELECT * FROM canciones WHERE id_playlist = $1`,
    values: [id_playlist]
  })
  return result.rows;
}



module.exports = {
  nuevoUsuario,
  obtenerUsuarioPorEmail,
  editarUsuario,
  nuevaPlaylist,
  obtenerPlaylistporIDUsuario,
  obtenerPlaylistPorID,
  editarPlaylist,
  agregarCancion,
  obtenerCancionesPorIDPlaylist,
  actualizarCancion,
  eliminarCancion,
  vaciarPlaylist,
}