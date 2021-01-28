const mongoose  = require('mongoose')
const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    isbn:{
        type:String,
        required:true
    },
    available:{
        type:Number,
        required:true
    },
    publisher:{
        name:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        date:{
            type:Date,
            required:true
        }
    }
    // nameChangeThis:{
    //     type:String,
    //     required:true
    // },
    // subscribedToChannelChangeThis:{
    //     type:String,
    //     required:true
    // },
    // subscribeDateChangeThis:{
    //     type:Date,
    //     required:true,
    //     default:Date.now
    // }
})

module.exports = mongoose.model('Book',bookSchema)