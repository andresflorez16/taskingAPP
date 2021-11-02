const mongoose = require('mongoose')
const { Schema } = mongoose

const Task =  new Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true },
    createDate: { type: Date, default: Date.now },
    user: { type: String }
})

module.exports = mongoose.model('Task', Task)
