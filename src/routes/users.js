const router = require('express').Router()
const User = require('../models/Users')
const passport = require('passport')


router.get('/users/signin', (req, res) => res.render('users/signin'))

router.get('/users/signup', (req, res) => res.render('users/signup'))

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/tasks',
    failureRedirect: '/users/signin',
    failureFlash: true
}))

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if(name.length <= 0 || email.length <= 0) {
        errors.push( { text: 'Please verify fields' })
    }
    if(password != confirmPassword) {
        errors.push({ text: `Passwords don't match` })
    }
    if(password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters!' })
    }
    const emailUser = await User.findOne({ email: email })
    if(emailUser) {
        errors.push( {text:'Email is already used'} )
    }
    if(errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, confirmPassword })
    }else {
        const user = new User({ name, email, password })
        user.password = await user.encryptPassword(password)
        await user.save()
        req.flash('successMsg', 'User added!')
        res.redirect('/tasks')
    }
})

router.get('/users/logout', (req, res) => {
    req.logout()
    res.redirect('/')

})

module.exports = router