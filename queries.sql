--Usuarios
CREATE TABLE users (
  id_usuario SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255) NOT NULL,
  fecha_muerte TIMESTAMP
);

SELECT * FROM users;

-- Tabla Playlist
CREATE TABLE playlist (
  id_playlist SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  id_usuario INTEGER NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES users(id_usuario),
  fecha_creacion TIMESTAMP
);

--Tabla Canciónes de cada usuario
CREATE TABLE canciones (
  id_cancion SERIAL PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  album VARCHAR(255) NOT NULL,
  artista VARCHAR(255) NOT NULL,
  comentario VARCHAR(255) NOT NULL,
  enlace VARCHAR(255) NOT NULL,
  id_playlist INTEGER NOT NULL,
  FOREIGN KEY (id_playlist) REFERENCES users(id_playlist)
);



SELECT * FROM playlist;

--