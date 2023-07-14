const connectToMongo=require('./db')
const express = require('express')
var cors=require('cors')

connectToMongo()
const app = express()
const port = 5000
app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello  shoeb!')
})


app.use('/api/auth',require('./router/auth'))
app.use('/api/notes',require('./router/notes'))


app.listen(port, () => {
  console.log(`i-Notebook app listening on port ${port}`)
})