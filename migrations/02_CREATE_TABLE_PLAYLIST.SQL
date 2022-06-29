-- Tabla Playlist
CREATE TABLE playlist (
  id_playlist SERIAL PRIMARY KEY,
  nombre_playlist VARCHAR(255) NOT NULL,
  id_usuario INTEGER NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES users(id_usuario),
  fecha_creacion TIMESTAMP
);