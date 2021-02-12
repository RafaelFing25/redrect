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
    views:{
        type: Number,
        default: 0
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('link',Schema)