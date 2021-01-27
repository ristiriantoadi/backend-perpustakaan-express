const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.post('/login', (req, res) => {
    return res.json({
      token:'token',
      username:"adi"
    })
})

app.get('/book', (req, res) => {
  
  return res.json({
    book:[{
      title:"title",
      author:"hello world",
      isbn:"random",
      available:true,
      publisher:{
        name:"y",
        date:"2021-01-12",
        country:"ireland"
      }
    }]
  })
})

app.post('/book', (req, res) => {
  console.log(req.body);
  res.sendStatus("200");
})

app.get('/member', (req, res) => {
  return res.json({
    member:[]
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})