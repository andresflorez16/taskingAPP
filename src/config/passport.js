const passport = require('passport')
const Local = require('passport-local').Strategy
const User = require('../models/Users')

passport.use(new Local({
    usernameField: 'email',
}, async (email, password, done) => {
    const user = await User.findOne({ email: email })

    if(!user) {return done(null, false, { message: 'Not user found' })}
    else {
        const match = await user.matchPassword(password)
        if(match) {return done(null, user)}
        else {return done(null, false, { message: 'Incorrect password' })}
    }
    
}))

passport.serializeUser((userr, done) => {
    done(null, userr.id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user)
    })
})