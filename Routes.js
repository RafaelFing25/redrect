const express = require('express')
const generateAleatorySlug = require('./helpers/generateAleatorySlug')
const router = express.Router()
const LinkModel = require('./modules/Link')
const UserModel = require('./modules/User')
const bcrypt = require('bcrypt')
const validationUser = require('./helpers/validationUser')


router.get('/', (req,res)=>{
    
    res.render('index')
})
router.post('/createlink',(req,res)=>{
    const url = req.body.url
    const slug = generateAleatorySlug()
    const saveDb ={
        url,
        slug
    }
     new LinkModel(saveDb).save().then(links=>res.redirect('/url/'+links._id)).catch(err=>console.log(err))
})  

router.get('/encurtar',(req,res)=>{
    res.render('encurt')
})

router.get('/url/:id',(req,res)=>{
    LinkModel.findById(req.params.id).then(link=>{
        res.render('urlshow',{link})
    }).catch(err=>{
        req.flash('error_msg',"Ocorreu um erro ao solicitar a url")
        req.redirect('/encurtar')
    })
})
router.get('/sobre',(req,res)=>{
    res.render('about')
})

router.get('/registrar',(req,res)=>{
    res.render('register')
})

router.post('/register',(req,res)=>{
    const user = req.body
    const erros = validationUser(user)
    console.log(erros.length)
    if(erros.length >= 1){
        console.log('loop')
        erros.map((erro)=>{req.flash('error_msg',erro)})
        res.redirect('/registrar')
    }
    UserModel.findOne({email:user.email}).then(existentUser=>{
        if(existentUser){
            req.flash("error_msg", "Email ja está sendo usado!")
            res.redirect('/registrar')
        }else{
            const password = bcrypt.hashSync(user.password,10)
            user.password = password
            const User = new UserModel(user).save().then(_=>{
                req.flash('success_msg',"Cadastro concluído! Desfrute das vantagems!")
                res.redirect('/')
            }).catch(err=>{
                req.flash('error_msg',"Infelizmente occorreu um erro no seu cadastro! Tente novamente")
                res.redirect('/registrar')
            })
        }
    }).catch(err=>{
        req.flash("error_msg", err+"Erro interno no servidor! Tente novamente!")
        res.redirect('/registrar')
    })
})


router.get('/:slug',(req,res)=>{
    const slug = req.params.slu
    LinkModel.findOne({slug:slug}).then(result=>{
        result.views = result.views + 1
        result.save().then(_=>{
            return res.redirect(result.url)
        }).catch(_=>cosole.log(err))
    }).catch(err=>res.redirect('/'))
})
module.exports = router