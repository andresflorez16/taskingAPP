const router = require('express').Router()
const Task = require('../models/Tasks')
const { isAuthenticated } = require('../helpers/auth')

router.get('/tasks/add', isAuthenticated, (req, res) => {
    res.render('tasks/new-task')
})
router.post('/tasks/new-task', isAuthenticated, async (req, res) => {
    const { title, description, date } = req.body
    const errors = []
    if(!title) {
        errors.push({text: 'Please write a title'})
    }
    if(!description) {
        errors.push({text: 'Please write a description'})
    }
    if(!date) {
        errors.push({text: 'Please write a date'})
    }
    if(errors.length > 0) {
        res.render('tasks/new-task', { errors, title, description, date })
    }else {
        const newTask = new Task({ title, date, description }) 
        newTask.user = req.user.id
        await newTask.save()
        req.flash('successMsg', 'Task added!')
        res.redirect('/tasks')
    }
})
router.get('/tasks', isAuthenticated, async (req, res) => {
    const tasks = await Task.find({ user: req.user.id }).sort({date: 'asc'}).lean()
    const user = req.user.name

    res.render('tasks/all-tasks', { tasks, user })
})

router.get('/tasks/edit/:id', isAuthenticated, async (req, res) => {
    const task = await Task.findById(req.params.id).lean()
    task.id = task._id.toString()
    res.render('tasks/edit-tasks', { task })
})

router.put('/tasks/edit-task/:id', isAuthenticated, async (req, res) => {
    const { title, date, description } = req.body
    await Task.findByIdAndUpdate(req.params.id, {
        title,
        date,
        description
    })
    req.flash('successMsg', 'Task updated!')
    res.redirect('/tasks')
})

router.delete('/tasks/delete/:id', isAuthenticated, async (req, res) => {
    await Task.findByIdAndDelete(req.params.id)
    req.flash('successMsg', 'Task deleted!')
    res.redirect('/tasks')
})

module.exports = router