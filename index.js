const express = require('express');
const app = express()
const multer = require('multer')
const morgan = require('morgan')
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"))
// app.use(morgan('dev'))

const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");

app.use("/", userRoute)
app.use("/", adminRoute)
app.use(multer().any());
app.listen(process.env.PORT);