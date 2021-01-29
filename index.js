const express = require('express')
const app = express()
const port = 5000

const cors = require('cors')
app.use(cors())

app.use(express.json())

require('dotenv').config();

//jwt
const jwt = require('jsonwebtoken')
const SECRET_KEY="secret_key"//change this with dotenv

//middleware for verifying token
function verifyToken(req,res,next){
  const authHeader = req.headers['token']
  // const token = authHeader && authHeader.split(' ')[1]
  const token = authHeader

  if (token == undefined){
      return res.sendStatus(401)//unauthorized or unauthenticated
  }

  jwt.verify(token,SECRET_KEY,(err,user)=>{
      if(err){
          return res.sendStatus(403)//forbidden
      }
      req.user = user
      next()
  })
}


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
const User = require("./models/User")

//routes
app.post('/login', async (req, res) => {

  const email = req.body.email
  const password = req.body.password
  try{
    const user = await User.findOne({ email,password }).exec();
    const token = jwt.sign({
      email:user.email,
      password:user.password
    },SECRET_KEY)
  
      return res.json({
        token:token,
        username:user.username
      })
  
  
  }catch(err){
    res.json({message:err.message})
  }
})

app.post('/user',async (req,res)=>{
  const username = req.body.username
  const email = req.body.email
  const password = req.body.password

  const user = new User({
    username,
    email,
    password
  })

try{
    const newUser = await user.save()
    res.status(201).json(newUser)
}catch(err){
    res.status(400).json({'message':err.message})
}
  
})

app.get('/book',verifyToken, async (req, res) => {
  try{
    const books = await Book.find()
    res.json({book:books})
  }catch(err){
    res.json({message:err.message})
  }

})

app.post('/book', verifyToken, async(req, res) => {
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

app.delete('/book/:id', verifyToken, async (req, res) => {
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

app.patch('/book/:id', verifyToken, async (req, res) => {
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

app.patch('/member/:id', verifyToken, async(req, res) => {
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

app.get('/member', verifyToken, async (req, res) => {
  try{
    const members = await Member.find()
    res.json({member:members})
  }catch(err){
    res.json({message:err.message})
  }
})

app.delete('/member/:id', verifyToken, async (req, res) => {
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


app.post('/member', verifyToken, async (req, res) => {
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
