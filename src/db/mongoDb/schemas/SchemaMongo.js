const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    nome:{
        type:String,
        required: true
    },
    poder:{
        type:String,
        required: true
    },
    insertedAt:{
        type:Date,
        default: new Date()
    }
})

module.exports = mongoose.model('modelHerois', schema)