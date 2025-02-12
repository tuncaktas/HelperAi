import express from 'express'
import { chatHandler } from './chat'
const app = express()

const PORT = 8000

app.get('/chat', chatHandler)


app.listen(PORT, () => {
    console.log(`Server is running on port: ` + PORT)
})