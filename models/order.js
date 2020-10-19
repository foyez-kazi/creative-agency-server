const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  userName: String,
  email: String,
  serviceTitle: String,
  serviceIcon: String,
  projectDetails: String,
  status: String,
})

module.exports = mongoose.model('Order', orderSchema)
