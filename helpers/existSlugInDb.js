const Link = require("../modules/Link")

const existSluginDb = async (slug) => {
    const link = await Link.findOne({slug:slug})
    console.log('link', link)
    link ? true : false
}

module.exports = existSluginDb