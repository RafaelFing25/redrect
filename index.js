const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars')
const routes = require('./Routes')
const apiRoutes = require('./apiRoutes')
const dotenv = require('dotenv')
dotenv.config()
const passport = require('passport')


// ! Configuraçoes
    //? sessão
        app.use(session({
            secret: "qualquercoisa",
            resave: true,
            saveUninitialized: true
        })) 
        app.use( passport.initialize());
        app.use( passport.session());
        
        app.use(flash())
    //? middlewares
        app.use((req,res, next) =>{
            res.locals.success_msg = req.flash('success_msg')
            res.locals.error_msg = req.flash('error_msg')
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
            next()
        } )
    //? Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //? Handlebars
        app.engine('handlebars', handlebars({
            handlebars: allowInsecurePrototypeAccess(Handlebars),
            defaultLayout: 'main',
            helpers: {
                formatDate: (date) => {
                    return moment(date).format('DD/MM/YYYY  hh:mm')
                }
            }
             }))
        app.set('view engine', 'handlebars')
    //? Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect(process.env.DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        useFindAndModify: false }).then(() => {
            console.log('Conectado com sucesso ao MongoDb')
        }).catch((err) => {
            console.log(err)
        })

    //? Public
        app.use(express.static('public'))

     // poassport
     require('./config/passport')
//! Rotas
    app.use(routes)
    app.use('/api',apiRoutes)

//! Outros
const PORTA = process.env.PORT || 8081
app.listen(PORTA, () => {
    console.log(`Servidor rodando em https://localhost:${PORTA} !`)
})