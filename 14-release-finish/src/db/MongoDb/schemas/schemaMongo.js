const Mongoose = require('mongoose')

const dateDefault = new Date()
const Schema = new Mongoose.Schema({
    nome:{
        type:String,
        required:true
    },
    poder:{
        type:String,
        required:true
    },
    insertedAt:{
        type:Date,
        default: dateDefault.getTime()
    }
})

module.exports = Mongoose.model('modelTableHerois', Schema)