const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const campground = require('./models/campground')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"))
db.once("open", () =>{
    console.log("Database connected")
})

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', async (req, res) =>{
    res.render('home')
})
app.get('/campgrounds', async (req, res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})
app.get('/campgrounds/:id', async (req, res) =>{
    const id = req.params.id
    const campground = await Campground.findById(id)
    
    res.render('campgrounds/show', {campground})
})


app.listen(8000, () =>{
    console.log('LISTENING ON PORT 8000')
})