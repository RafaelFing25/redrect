const mongoose = require('mongoose')
const Schema = mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('link',Schema)