const connectToMongo= require('./db');
const express = require('express')
var cors= require('cors')
connectToMongo();

const app = express()
const port = 5000

// app.get('/', (req, res) => 
//   res.send('Hello World!')
// )

// app.get('/home/proj', (req, res) => {
//     res.send('Home!')
// })

// app.get('/Proj/about', (req, res) => {
//     res.send('About!')
// })

app.use(cors())
app.use(express.json())//if we want to use request.body then we have to use this middle ware
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook backend listening on port http://localhost:${port}`)
})