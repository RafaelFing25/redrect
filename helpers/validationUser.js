function validationUser(user){
    new RegExp('')
    const erros = []
        if(user.name === undefined){
            erros.push("Você precisa colocar um nome")
        }else if(user.name.length < 4){
            erros.push('Seu nome deve ter mais de 4 caracteres')
        }else if(user.email === undefined){
            erros.push("Você precisa preencher um email")
        }else if(!validateEmail(user.email)){
            erros.push('Email invalido')
        }else if(user.password.length < 6){
            erros.push('A senha deve conter mais de 6 caracteres!')
        }
    return erros
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

module.exports = validationUser