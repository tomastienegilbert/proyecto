--borrar tabla canciones
DROP TABLE canciones;

--borrar tabla playlists
DROP TABLE playlists;

--borrar tabla usuarios
DROP TABLE usuarios;

--Usuarios
CREATE TABLE usuarios (
  id_usuario SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  fecha_muerte TIMESTAMP
);

-- Tabla Playlist
CREATE TABLE playlists (
  id_playlist SERIAL PRIMARY KEY,
  nombre_playlist VARCHAR(255) NOT NULL,
  id_usuario INTEGER NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  fecha_creacion TIMESTAMP
);

--borrar tabla canciones
DROP TABLE canciones;

--Tabla Canciónes de cada usuario
CREATE TABLE canciones (
  id_cancion SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  album VARCHAR(255) NOT NULL,
  artista VARCHAR(255) NOT NULL,
  comentario VARCHAR(255) NOT NULL,
  enlace VARCHAR(255) NOT NULL,
  id_playlist INTEGER NOT NULL,
  FOREIGN KEY (id_playlist) REFERENCES playlists(id_playlist)
);

--eliminar todas las canciones con determinada id_playlist
DELETE FROM canciones WHERE id_playlist = 1;