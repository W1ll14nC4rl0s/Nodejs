const Mongoose = require('mongoose')

const ModelAuth = new Mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    insertedAt:{
        type:Date,
        default: new Date()
    }
})

module.exports = Mongoose.model('modelSignIn', ModelAuth)