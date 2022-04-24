import express from 'express'
import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'
const app = express()

dotenv.config()

const PORT = 4000

const MONGO_URL = process.env.MONGO_URL

// const MONGO_URL = 'mongodb://localhost'

// Connect to MongoDB

async function createConnection() {
	const client = new MongoClient(MONGO_URL)
	await client.connect()
	console.log('Connected to MongoDB')
	return client
}


const client = await createConnection()

// Add express middleware to parse JSON bodies automatically

app.use(express.json())

// Read collection from MongoDB
const movies = client.db('classMongo').collections.movies

// Basic request handler
app.get('/', function (req, res) {
	res.send('Hello World')
})

app.get('/movies', function (req, res) {
	const { rating } = req.query

	rating
		? res.send(
				movies.filter((movie) => {
					return movie.rating == rating
				})
		  )
		: res.send(movies)
})

app.post('/movies', async function (req, res) {
	const newMovies = req.body
	console.log(newMovies)
	const result = await client
		.db('classMongo')
		.collection('movies')
		.insertMany(newMovies)
	res.send(result)
})

app.get('/movies/:id', async function (req, res) {
	const { id } = req.params
	const movie = await client.db('classMongo').collection('movies').findOne({
		id: id,
	})
	movie
		? res.send(movie)
		: res
				.status(404)
				.send(
					'<h1 style="text-align:center">Error 404<br/><hr/>Movie not found</h1>'
				)
})

app.delete('/movies/:id', async function (req, res) {
	const { id } = req.params
	const result = await client
		.db('classMongo')
		.collection('movies')
		.deleteOne({ id: id })
	res.send(result)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
