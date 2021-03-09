const passport = require('passport')
const User =require('../modules/User')
const dotenv = require('dotenv')
dotenv.config()

const GoogleStrategy = require('passport-google-oauth2').Strategy

passport.use(new GoogleStrategy({
    clientID : process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET_KEY,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback:true
},async (req,accessToken,refreshToken,profile,done)=>{
    console.log(profile)
    const user = await User.findOne({email: profile._json.email})
    if(user){
        console.log(user)
        return done(null,user)
    }else{
        const minProfile = profile._json
        const newUser = {
            fullName : minProfile.name,
            firstName: minProfile.given_name,
            lastName: minProfile.family_name,
            email: minProfile.email,
            picture: minProfile.picture,
            emailVerified: minProfile.email_verified,
            locale: minProfile.locale
        }
        const userCreated = await User.create(newUser)
        console.log(userCreated)
        return done(null,userCreated)
    }
}
))

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});