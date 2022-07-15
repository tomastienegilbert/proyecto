-- Tabla Playlist
CREATE TABLE playlists (
  id_playlist SERIAL PRIMARY KEY,
  nombre_playlist VARCHAR(255) NOT NULL,
  id_usuario INTEGER NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
  fecha_creacion TIMESTAMP
);