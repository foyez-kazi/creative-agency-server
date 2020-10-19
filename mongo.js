const mongoose = require('mongoose')

const url = ``

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const adminSchema = new mongoose.Schema({
  email: String,
  createAt: Date,
})

const Admin = mongoose.model('Admin', adminSchema)

const admin = new Admin({
  email: '',
  createdAt: new Date(),
})

admin.save().then((result) => {
  console.log(result)
  mongoose.connection.close()
})
