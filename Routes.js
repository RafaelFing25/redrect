const express = require('express')
const generateAleatorySlug = require('./helpers/generateAleatorySlug')
const router = express.Router()
const LinkModel = require('./modules/Link')
const UserModel = require('./modules/User')
const bcrypt = require('bcrypt')
const validationUser = require('./helpers/validationUser')
const passport = require('passport')
const saveDb = require('./helpers/saveDb')
const existSluginDb = require('./helpers/existSlugInDb')

// Nunca descomente em produçao NUNCA, Isso exclui tudo os usuarios krl
//UserModel.deleteMany().then(_=>console.log('deletado')).catch(err=>console.log(err))

router.get('/', (req,res)=>{
    
    res.render('index')
})
router.post('/createlink',async(req,res)=>{
    const url = req.body.url
    if (req.body.slug){
            if(await existSluginDb(req.body.slug)){
                req.flash("error_msg","Slug ja existe")
                res.redirect('/encurtar')
            }else{
                const save = {
                    url,
                    slug: req.body.slug
                }
            
                saveDb(req,res,save)
            }
        
        
    }else{
        var slug = generateAleatorySlug()
        
        while(await existSluginDb(slug)){
            slug = generateAleatorySlug()
        }
        const save ={
            url,
            slug
        }
        saveDb(req,res,save)
    }
})  

router.get('/encurtar',(req,res)=>{
    res.render('encurt')
})

router.get('/url/:id',(req,res)=>{
    LinkModel.findById(req.params.id).then(link=>{
        const host = req.get('host')
        const protocol = req.protocol
        res.render('urlshow',{link,host,protocol})
    }).catch(err=>{
        req.flash('error_msg',"Ocorreu um erro ao solicitar a url")
        res.redirect('/encurtar')
    })
})
router.get('/sobre',(req,res)=>{
    res.render('about')
})

router.get('/registrar',(req,res)=>{
    res.render('register')
})

router.get('/google/login',passport.authenticate('google',{scope:['profile','email']}))

router.get( '/google/callback', 
    	passport.authenticate( 'google', { 
    		successRedirect: '/profile',
    		failureRedirect: '/login'
}));

router.get('/profile',(req,res)=>{
    if(!req.isAuthenticated()){
        res.render('noprofile')
    }else{
        UserModel.findById(req.user._id).lean().populate('links').then(user=>{
            const host = req.get('host')
            const protocol = req.protocol
            user.links.forEach(link => {
                link.protocol = protocol
                link.host = host
            });
            console.log(user)
            res.render('profile',{user,host})
        }).catch(err=>{
            console.log(err)
            req.flash("error_msg", "Erro ao encotrar usuario")
            res.redirect('/')
        })
    }
})

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
  
router.post('/link/edit',(req,res)=>{
    LinkModel.findById(req.body.id).then(link=>{
        link.url = req.body.url
        link.slug = req.body.slug

        link.save().then(_=>{
            req.flash("sucsess_msg","Sucesso ao editar!")
            res.redirect('/profile')
        }).catch(err=>{
            req.flash("error_msg","Erro ao salvar!")
            res.redirect('/profile')
        })
    }).catch(err=>{
        req.flash('error_msg',"Erro ao edita")
        res.redirect('/profile')
    })
})
router.post('/link/delete',(req,res)=>{
    LinkModel.deleteOne({id:req.body.id}).then(_=>{
        LinkModel.findById(req.body.id).then(link=>{
            UserModel.findById(req.user._id).then(user=>{
                const index = user.links.indexOf(link._id)
                user.links.splice(index,1)
                user.save().then(_=>{
                    req.flash('success_msg', "Deletado com sucesso")
                    res.redirect('/profile')
                }).catch(err=>{
                    req.flash('error_msg',"Erro ao excluir tente novamente")
                    res.redirect('/profile')
                })
                
            }).catch(err=>{
                console.log(err)
                req.flash("error_msg","erro")
                res.redirect('/profile')
            })
        }).catch(_=>{  
            req.flash("error_msg","Não foi possivel fazer a exclusão")
            res.redirect('/profile')
        })
        
    }).catch(err=>{
        console.log(err)
        req.flash("error_msg","Não foi possivel fazer a exclusão")
        res.redirect('/profile')
    })
})

router.get('/privacy-policy',(res,get)=> {
    
})

router.get('/:slug',(req,res)=>{
    const slug = req.params.slug
    LinkModel.findOne({slug:slug}).then(result=>{
        result.views = result.views + 1
        result.save().then(_=>{
            return res.redirect(result.url)
        }).catch(_=>cosole.log(err))
    }).catch(err=>res.redirect('/'))
})
module.exports = router