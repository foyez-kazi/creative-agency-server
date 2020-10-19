const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  userName: String,
  userImage: String,
  companyName: String,
  description: String,
  createAt: Date,
})

module.exports = mongoose.model('Review', reviewSchema)
