import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import router from './routes/index'

const PORT = process.env.PORT || 5000

const app = express()
dotenv.config()

app.use(express.json())
app.use(cors())
app.use('/api', router)

const start = () => {
	try {
		app.listen(PORT, () => {
			console.log(`listening on port ${PORT}`)
		})
	} catch (error) {
		console.log(error)
	}
}

start()
