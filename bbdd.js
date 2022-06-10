const bcrypt = require('bcrypt');
const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bbdd',
    password: 'postgres',
    port: 5432
})


//registrar usuario encryptando password con bcrypt
const newUser = (req, res) => {
    const { email, nombre, apellido, password, fecha_muerte } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    pool.query('INSERT INTO users (email, nombre, apellido, password, fecha_muerte) VALUES ($1, $2, $3, $4, $5)', [email, nombre, apellido, hash, fecha_muerte], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`Usuario ${email} registrado`)
    })
}


//crear playlist con canciones
const newSong = (req, res) => {
    const { titulo, album, artista, comentario, enlace } = req.body;
    pool.query('INSERT INTO songs (titulo, album, artista, comentario, enlace) VALUES ($1, $2, $3, $4, $5)', [titulo, album, artista, comentario, enlace], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`Cancion ${titulo} registrada`)
    })
}


const deleteSong = (req, res) => {
    const { id } = req.params;
    pool.query('DELETE FROM playlist WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(`Cancion ${id} eliminada`)
    })
}

const editSong = (req, res) => {
    const { id } = req.params;
    const { titulo, album, artista, comentario, enlace } = req.body;
    pool.query('UPDATE songs SET titulo = $1, album = $2, artista = $3, comentario = $4, enlace = $5 WHERE id = $6', [titulo, album, artista, comentario, enlace, id], (error, results) => {
        if (error) {
            throw error
        }
        res.status(200).send(`Cancion ${id} editada`)
    })
}