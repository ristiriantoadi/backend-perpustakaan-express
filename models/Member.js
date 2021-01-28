const mongoose  = require('mongoose')
const memberSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    kelas:{
        type:String,
        required:true
    },
    borrowedBooks:{
        books:{
            type:Array,
            required:true
        },
        schedule:{
            type:Date,
            required:true
        },
        borrowedDate:{
            type:Date,
            required:true
        }
    }
})

module.exports = mongoose.model('Member',memberSchema)