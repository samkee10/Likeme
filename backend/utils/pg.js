require('dotenv').config()
const { Pool } = require('pg');

const config = {
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    database: process.env.PG_DATABASE,
    allowExitOnidle: true
}

const pool = new Pool(config)

const readPosts = async () => {
  const result = await pool.query( 'SELECT * FROM posts;')
  return result.rows
}

const createPosts = async ({id, titulo, url, descripcion}) => {
  try {
  const query = 'INSERT INTO posts (id, titulo, img, descripcion) values ($1, $2, $3, $4) RETURNING *;'
  const values = [id, titulo, url, descripcion]
  const result = await pool.query(query,values)
  return result.rows
}catch (error) {
  return { code: 500, error, mensaje: "error al crear post" }
}
}

const deletePosts = async (id) => {
  try{
  const query = 'DELETE FROM posts WHERE id = $1 RETURNING *;'
  const values = [id]
  const result = await pool.query(query, values)
  return result.rows
}catch(error) {
  return {code: 500, error, mensaje: "error al eliminar el post"}
}
  }

const updatePosts = async (id ) => {

  const query = 'UPDATE  posts SET likes = COALESCE(likes,0)+1 WHERE id = $1 RETURNING *;'
  const values = [id]
  const result = await pool.query(query, values)
  return result.rows
}

const reportarConsulta = async (req, _, next) => {
  const parametros = req.body
  const url = req.url
  console.log(`
  Hoy ${new Date()}
  Se ha recibido una consulta en la ruta ${url}
  con los parámetros:
  `, parametros)
  next()
  }

module.exports = {readPosts, createPosts, deletePosts, updatePosts, reportarConsulta}
