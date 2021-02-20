const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

const random = ()=>{
    const number = Math.round(Math.random()*26)
    return number
}

const getSlug = () =>{
    const slug = []
    for(let i = 0; i<6;i++){
        const letter = alphabet[random()]
        slug.push(letter)
    }
    return slug
}

function generateAleatorySlug(){
    const slug = getSlug().join('')
    return slug
}

module.exports = generateAleatorySlug