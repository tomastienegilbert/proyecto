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