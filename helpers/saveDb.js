const Link = require("../modules/Link")
const UserModel = require("../modules/User")

const saveDb = (req,res,item) => {
    new Link(item).save().then(link=>{
        if(req.user){
            UserModel.findById(req.user._id).then(user=>{
                user.links = [...user.links, link ]
                user.save().then(_=>{
                    
                    res.redirect('/url/'+link._id)

                }).catch(err=>{
                    console.log(err)
                    req.flash('error_msg',"Erro ao criar link")
                    res.redirect('/encurtar')
                })

            }).catch(err=> {
                console.log(err)
                req.flash('error_msg', "erro Interno")
                res.redirect('/encurtar')
            })
        }else{
            req.flash("sucsses_msg","Criado")
            res.redirect('/url/'+link._id)
        }
    }).catch(err=>console.log(err))
}

module.exports = saveDb