const mongoose = require("mongoose")
const express = require("express")
const app = express()

const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config();


// connecting to mongodb
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("Database Connected!!")
}).catch(() => {
    console.log("Unable to connect to the database.")
})

// use parsing middlewares
app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(cors())

// importing routes
const userRoutes = require("./routes/user")
const eventRoutes = require("./routes/event")

// using routes 
app.use('/api', userRoutes)
app.use('/api', eventRoutes)

const port = process.env.PORT || 8000

// starting the server
app.listen(port, () => {
    console.log(`Application is running at ${port}`)
})

 

