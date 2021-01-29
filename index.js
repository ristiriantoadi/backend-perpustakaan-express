const express = require('express')
const app = express()
const port = 5000

const cors = require('cors')
app.use(cors())

app.use(express.json())

require('dotenv').config();

//connect ke mongodb
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,
{ useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error',(error)=>console.error(error))
db.once('open',()=>console.log('connected to database'))

//import schema Mongoose
const Book = require("./models/Book")
const Member = require("./models/Member")

//routes
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
  try{
    const newBook = await book.save()
    res.status(201).json(newBook)
  }catch(err){
    res.status(400).json({'message':err.message})
  }
})

app.delete('/book/:id', async (req, res) => {
  try{
    const book = await Book.findById(req.params.id)  
    if(book){
      await book.remove()
      return res.json({'message':'deleted'})  
    }
    return res.json({'message':'cannot find book'})
  }catch(err){
    res.status(500).json({'message':err.message})
  }
})

app.patch('/book/:id', async (req, res) => {
  //pinjam buku
  if(req.body.available !== null){
    try{
      const book = await Book.findById(req.params.id)  
      if(book){ 
        book.available = req.body.available
        const updatedBook = await book.save()
        return res.json(updatedBook) 
      }
      return res.status(404).json({'message':"can't find subscriber"})
    }catch(err){
      return res.status(500).json({'message':err.message})
    }
  }
  //edit buku
  try{
    const book = await Book.findById(req.params.id)  
    if(book){ 
      if(req.body !== null){
        book.author = req.body.author
        book.title = req.body.author
        book.isbn = req.body.isbn
        book.available = req.body.available
        book.publisher = req.body.publisher
        const updatedBook = await book.save()
        return res.json(updatedBook);
      } 
    }
    return res.status(404).json({'message':"can't find book"})
  }catch(err){
    res.status(500).json({'message':err.message})
  }
})

app.patch('/member/:id', async(req, res) => {
  //pinjam buku
  if(req.body.borrowedBooks){
    try{
      const member = await Member.findById(req.params.id)  
      if(member){ 
        member.borrowedBooks = req.body.borrowedBooks
        const updatedMember = await member.save()
        return res.json(updatedMember) 
      }
      return res.status(404).json({'message':"can't find member"})
    }catch(err){
      return res.status(500).json({'message':err.message})
    }
  }
  //edit member
  try{
    const member = await Member.findById(req.params.id)  
    if(member){ 
      if(req.body !== null){
        member.name = req.body.name
        member.kelas = req.body.kelas
        const updatedMember = await member.save()
        return res.json(updatedMember);
      } 
    }
    return res.status(404).json({'message':"can't find member"})
  }catch(err){
    res.status(500).json({'message':err.message})
  }
})

app.get('/member', async (req, res) => {
  try{
    const members = await Member.find()
    res.json({member:members})
  }catch(err){
    res.json({message:err.message})
  }
})

app.delete('/member/:id', async (req, res) => {
  try{
    const member = await Member.findById(req.params.id)  
    if(member){
      await member.remove()
      return res.json({'message':'deleted'})  
    }
    return res.json({'message':'cannot find member'})
  }catch(err){
    res.status(500).json({'message':err.message})
  }
})


app.post('/member', async (req, res) => {
  const name = req.body.name
  const kelas = req.body.kelas
  const member = new Member({
    name,
    kelas
  })
  try{
      const newMember = await member.save()
      res.status(201).json(newMember)
  }catch(err){
      res.status(400).json({'message':err.message})
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
