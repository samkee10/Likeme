require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { createPosts, readPosts, deletePosts, updatePosts, reportarConsulta} = require('../utils/pg')

const PORT = process.env.PORT ?? 3000
const app = express()

app.use(cors())
app.use(express.json())

app.get('/posts', async (_, res) => {
    try {
        const result = await readPosts()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json(error)
    }
})

app.post('/posts', reportarConsulta, async (req, res) => {
    const { id, titulo, url, descripcion } = req.body
    if(!id || !titulo || !url || !descripcion) {
		return res.status(400).json( {error: 'Faltan datos'})
	}
    try {
        const result = await createPosts(req.body)
        res.status( result?.code ? 500 : 201 ).json( result );
    }catch (error) {
        res.status(500).json(error)
    }
})

app.delete("/posts/:id", async (req, res) => {
    try{
        const { id } = req.params
        await deletePosts(id)
        res.status(204).json("posts eliminado con éxito")
    } catch(error) {
        res.status(500).json(error)
    }
})

app.put("/posts/like/:id", async (req, res) => {
    try{
        const { id } = req.params
        await updatePosts(id)
        res.status(200).json("Posts modificado con éxito")
    } catch(error) {
        res.status(500).json(error)
    }
})

app.all('*', (_, res) =>
    res.status(201).json({ code: 201, message: 'Resource not found' })
)

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`)
})



module.exports = app
