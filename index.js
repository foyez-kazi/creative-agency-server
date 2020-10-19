require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const fileUpload = require('express-fileupload')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const Review = require('./models/review')
const Service = require('./models/service')
const Order = require('./models/order')
const Admin = require('./models/admin')

const app = express()

// middleware
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('serviceIcons'))
app.use(fileUpload())

app.get('/api/reviews', (req, res) => {
  Review.find({})
    .sort({ createdAt: 'desc' })
    .then((reviews) => {
      res.json(reviews.slice(0, 3))
    })
})

app.get('/api/services', (req, res) => {
  Service.find({})
    .sort({ createdAt: 'desc' })
    .then((services) => {
      res.json(services.slice(0, 3))
    })
})

app.get('/api/orders', (req, res) => {
  const email = req.query.email

  if (email) {
    Order.find({ email }).then((orders) => {
      res.json(orders)
    })
  } else {
    Order.find({}).then((orders) => {
      res.json(orders)
    })
  }
})

app.put('/api/orders/:orderId', async (req, res) => {
  const { status } = req.body

  let order = await Order.findByIdAndUpdate(req.params.orderId, { new: true })

  if (order) {
    const { userName, email, projectDetails, serviceTitle, serviceIcon } = order

    order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { userName, serviceTitle, serviceIcon, email, projectDetails, status },
      { new: true },
    )

    return res.json(order)
  }

  res.status(404).end()
})

app.post('/api/orders', async (req, res) => {
  const { userName, email, serviceTitle, projectDetails } = req.body
  let serviceIcon

  const service = await Service.findOne({ serviceTitle })
  serviceIcon = service.iconUrl

  const order = new Order({
    userName,
    email,
    serviceTitle,
    serviceIcon,
    projectDetails,
    status: 'Pending',
  })

  order.save().then((savedOrder) => {
    res.json(savedOrder)
  })
})

app.post('/api/reviews', async (req, res) => {
  const { userName, companyName, description, userImage } = req.body

  const review = new Review({
    userName,
    userImage,
    companyName,
    description,
    createAt: new Date(),
  })

  review.save().then((savedReview) => {
    res.json(savedReview)
  })
})

app.post('/api/admins', async (req, res) => {
  const { email } = req.body

  const admin = new Admin({
    email,
    createAt: new Date(),
  })

  admin.save().then((savedAdmin) => {
    res.json(savedAdmin)
  })
})

app.post('/api/isAdmin', async (req, res) => {
  const { email } = req.body
  const admin = await Admin.findOne({ email })

  if (!admin) return res.send({ isAdmin: false })

  return res.send({ isAdmin: true })
})

app.post('/api/services', async (req, res) => {
  const { serviceTitle, description } = req.body
  const file = req.files.iconUrl

  file.mv(`${__dirname}/serviceIcons/${file.name}`, (err) => {
    if (err) {
      console.log(err)
      return res.status(500).send({ message: 'Failed to upload image' })
    }
  })

  // const newImg = iconUrl.data
  // const encImg = newImg.toString('base64')
  // const image = {
  //   contentType: iconUrl.mimetype,
  //   size: iconUrl.size,
  //   img: Buffer.from(encImg, 'base64'),
  // }

  const service = new Service({
    serviceTitle,
    description,
    iconUrl: file.name,
    createdAt: new Date(),
  })

  service.save().then((savedService) => {
    res.json(savedService)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server starts on ${PORT}`))
