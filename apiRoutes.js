const router = require('express').Router()
const Link = require('./modules/Link')

router.get('/details/:id',(req,res) => {
    Link.findById(req.params.id).then(link=>{
        res.json(link)
    }).catch(err=>{
        res.status(400).json({error: "Error to found"})
    })
})

module.exports = router