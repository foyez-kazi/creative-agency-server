const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
  email: String,
  createAt: Date,
})

module.exports = mongoose.model('Admin', adminSchema)
