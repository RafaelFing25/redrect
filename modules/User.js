const mongoose =  require('mongoose')
const Schema = mongoose.Schema({
    firstName:{
        type:String,
        required: true
    },
    lastName:{
        type:String,
    },
    fullName:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    picture:{
        type: String,
    },
    emailVerified:{
        type:Boolean
    },
    locale:{
        type:String
    },
    links:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "link"
        }
    ]
    
})

module.exports = mongoose.model('users',Schema)
