const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
  serviceTitle: String,
  description: String,
  iconUrl: String,
  createdAt: Date,
})

module.exports = mongoose.model('Service', serviceSchema)
