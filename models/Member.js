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
        type:Array
    }
    // borrowedBooks:{
    //     books:{
    //         type:Array,
    //         required:false
    //     },
    //     schedule:{
    //         type:Date,
    //         required:false
    //     },
    //     borrowedDate:{
    //         type:Date,
    //         required:false
    //     }
    // }
})

module.exports = mongoose.model('Member',memberSchema)