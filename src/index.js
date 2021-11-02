const express = require('express')
const hbs = require('express-handlebars')
const path = require('path')
const method = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const db = require('./database')()
const passport = require('passport')

const app = express()
require('./config/passport')

//Settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', hbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}))
app.set('view engine', '.hbs')

//Midlewares
app.use(express.urlencoded({ extended: false }))
app.use(method('_method'))
app.use(session({
    secret: 'mySecretApp',
    resave: true,
    saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Global variables
app.use((req, res, next) => {
    res.locals.successMsg = req.flash('successMsg')
    res.locals.errorMsg = req.flash('errorMsg')
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null
    
    next()
})


//Routes
app.use(require('./routes/index'))
app.use(require('./routes/tasks'))
app.use(require('./routes/users'))

//Static Files
app.use(express.static(path.join(__dirname, 'public')))


app.listen(app.get('port'), () => console.log('Server on port:', app.get('port')))

