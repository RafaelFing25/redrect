const express = require('express')
const generateAleatorySlug = require('./helpers/generateAleatorySlug')
const router = express.Router()
const LinkModel = require('./modules/Link')


router.get('/',(req,res)=>{
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

router.get('/:slug',(req,res)=>{
    const slug = req.params.slug
    console.log(slug)
    LinkModel.findOne({slug:slug}).lean().then(result=>{
        return res.redirect(result.url)
    }).catch(err=>res.redirect('/'))
})

module.exports = router