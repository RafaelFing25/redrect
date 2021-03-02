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
     new LinkModel(saveDb).save().then(links=>res.redirect('/show/'+links._id)).catch(err=>console.log(err))
})  

router.get('/encurtar',(req,res)=>{
    res.render('encurt')
})

router.get('/show/:id',(req,res)=>{
    LinkModel.findById(req.params.id).then(link=>{
        res.render('urlshow',{link})
    }).catch(err=>{
        req.flash('error_msg',"Ocorreu um erro ao solicitar a url")
        res.redirect('/encurtar')
    })
})
router.get('/sobre',(req,res)=>{
    res.render('about')
})



router.get('/:slug',(req,res)=>{
    const slug = req.params.slug
    LinkModel.findOne({slug:slug}).then(result=>{
        result.views = result.views + 1
        result.save().then(_=>{
            return res.redirect(result.url)
        }).catch(_=>cosole.log(err))
    }).catch(err=>{
        console.log(err)
             res.redirect('/')
    })
})
module.exports = router
