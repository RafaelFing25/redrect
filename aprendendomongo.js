const mongose = require('mongoose');


//conectando ao moongose
mongose.Promise = global.Promise;
mongose.connect("mongodb://localhost/teste",{useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('Conectado com succeso ao Mongodb')
}).catch((err) => {
    console.log(`O seguinte erro ocoreu: ${err}`)
})

//!model
// ? Definindo o model
const UsuarioSchema = mongose.Schema({
    nome: {
        //*tipo
        type: String,
        //*obrigatorio
        require: true
    },
    sobrenome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    idade: {
        type:Number,
        require:true
    },
    pais: {
        type: String
    }

})
//? Colection
mongose.model('usuarios', UsuarioSchema )

const Rafael = mongose.model('usuarios')

new Rafael ({
    nome: 'Rafael',
    sobrenome: 'Finger Lenz',
    email: 'rafateste@email.com',
    idade: 15,
    pais: 'Brasil'
}).save().then(() => {
    console.log('Usuario Cadastrado')
}).catch((err) => {
    console.log(`Erro: ${err}`)
})

