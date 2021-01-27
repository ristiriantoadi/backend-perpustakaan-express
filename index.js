require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000
const Subscriber = require('./models/subscriber')

//connect to mongodb
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,
{ useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection
db.on('error',(error)=>console.error(error))
db.once('open',()=>console.log('connected to database'))

//setup so that express can accept json
app.use(express.json())


//get all subscribers
app.get('/subscriber', async (req, res) => {
  // res.send('Hello World!')
  try{
    const subscribers = await Subscriber.find()
    res.json(subscribers)
  }catch(err){
    res.status(500).json({'message':err})
  }
})


//get subscriber by id
app.get('/subscriber/:id', async (req, res) => {
  try{
    const subscriber = await Subscriber.findById(req.params.id)  
    if(subscriber){
      return res.json(subscriber)  
    }
    return res.status(404).json({'message':"can't find subscriber"})
  }catch(err){
    res.status(500).json({'message':err.message})
  }
})

//delete subscriber
app.delete('/subscriber/:id', async (req, res) => {
  try{
    const subscriber = await Subscriber.findById(req.params.id)  
    if(subscriber){
      await subscriber.remove()
      return res.json({'message':'deleted'})  
    }
    return res.json({'message':'cannot find subscriber'})
  }catch(err){
    res.status(500).json({'message':err.message})
  }
})


//add new subscriber
app.post('/subscriber/add', async (req, res) => {
  const subscriber = new Subscriber({
    name:req.body.name,
    subscribedToChannel:req.body.subscribedToChannel
  })

  try{
    const newSubscriber = await subscriber.save()
    res.status(201).json(newSubscriber)
  }catch(err){
    res.status(400).json({'message':err})
  }
})

//update subscriber
app.patch('/subscriber/:id',async(req,res)=>{
  try{
    const subscriber = await Subscriber.findById(req.params.id)  
    if(subscriber){ 
      if(req.body.name !== null){
        subscriber.name = req.body.name
        const updatedSubscriber = await subscriber.save()
        res.json(updatedSubscriber)
      } 
    }
    return res.status(404).json({'message':"can't find subscriber"})
  }catch(err){
    res.status(500).json({'message':err.message})
  }
})

// app.get('/coba', (req, res) => {
//     res.send('coba!')
// })

// app.get('/coba/:id', (req, res) => {
//     res.send(req.params.id)
// })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
