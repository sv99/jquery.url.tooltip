const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/tooltip', function (req, res) {
  res.send('My first tooltip!')
})

app.get('/tooltip/:id', function (req, res) {
  res.send(`My second tooltip: ${req.params.id}!`)
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
