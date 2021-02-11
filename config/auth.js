const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
require("../modules/Usuario")
const Usuario = mongoose.model('usuarios')

module.exports = function(passport){
    passport.use(new localStrategy({usernameField: 'email', passwordField:"senha"},(email,senha,done)=>{
        Usuario.findOne({email:email}).then(usuario=>{
            if(!usuario){
                return done(null,false,{message:"Email nao cadastrado"})
            }else{
                bcrypt.compare(senha, usuario.senha).then((estaCerto)=>{
                    if(estaCerto){
                        return done(null,usuario)
                    }else{
                        return done(null,false,{message:"Senha incoreta"})
                    }
                })
            }
        })
    }))

    passport.serializeUser((usuario,done)=>{
        done(null,usuario.id)
    })

    passport.deserializeUser((id,done)=>{
        Usuario.findById(id,(err,usuario)=>{
            done(err,usuario)
        })
    })
}