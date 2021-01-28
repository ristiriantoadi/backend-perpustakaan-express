const express = require('express')
const app = express()
const port = 5000
const cors = require('cors')

app.use(cors())
app.use(express.json())

// var books=[{
//   _id:"123",
//   title:"title",
//   author:"hello world",
//   isbn:"random",
//   available:10,
//   publisher:{
//     name:"y",
//     date:"2021-01-12",
//     country:"ireland"
//   }
// }]

// var members=[{
//   _id:"111",
//   name:"adi",
//   kelas:"2a",
//   //borrowedBooks: {books: Array(0), schedule: "", borrowedDate: "2021-01-27T23:05:20.815Z"}
//   //can only borrow books one time
//   borrowedBooks:{
//     books:[]
//   }
// },
// {
//   _id:112,
//   name:"ananta",
//   kelas:"2a",
//   borrowedBooks:{
//     books:[]
//   }
// }]


require('dotenv').config();
console.log(process.env.DATABASE_URL)
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,
{ useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error',(error)=>console.error(error))
db.once('open',()=>console.log('connected to database'))

const Book = require("./models/Book")
const Member = require("./models/Member")

app.post('/login', (req, res) => {
    return res.json({
      token:'token',
      username:"adi"
    })
})

app.get('/book', async (req, res) => {
  
  try{
    const books = await Book.find()
    res.json({book:books})
  }catch(err){
    res.json({message:err.message})
  }

})

app.post('/book', async(req, res) => {
  const author = req.body.author;
  const title = req.body.title;
  const isbn = req.body.isbn;
  const available = req.body.available;
  const publisher = req.body.publisher;
  const book = new Book({
    author,
    title,
    isbn,
    available,
    publisher
  })
  console.log(book);
  try{
    const newBook = await book.save()
    res.status(201).json(newBook)
  }catch(err){
    res.status(400).json({'message':err.message})
  }

  // res.sendStatus("200");
})

app.patch('/book/:id', (req, res) => {
  
  books = books.map(book=>{
    if(book._id == req.params.id){
      book.available = req.body.available;
    }
    return book;
  })

  // console.log(books)
  
  res.sendStatus("200");

})

app.patch('/member/:id', (req, res) => {

  console.log(req.params.id)

  members = members.map(member=>{
    if(member._id == req.params.id){
      console.log("match")
      member.borrowedBooks = req.body.borrowedBooks
    }
    return member;
  })

  console.log(members)
  
  res.sendStatus("200");

})

app.get('/member', async (req, res) => {
  
  try{
    const members = await Member.find()
    res.json({member:members})
  }catch(err){
    res.json({message:err.message})
  }
  
  // return res.json({member:members})
})

app.post('/member', (req, res) => {
  // return res.json({
  //   member:[]
  // })
  console.log(req.body)
  res.sendStatus(200);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
