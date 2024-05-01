const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
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

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

//* Home Page and show all campgrounds
app.get('/', async (req, res) =>{
    res.render('home')
})

app.get('/campgrounds', async (req, res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
})

//* Add a new campground
app.get('/campgrounds/new', (req, res) =>{
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) =>{
    const campground =  new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
})

//* Show campgrounds details
app.get('/campgrounds/:id', async (req, res) =>{
    const id = req.params.id
    const campground = await Campground.findById(id)
    
    res.render('campgrounds/show', {campground})
})


//* Edit campgrounds
app.get('/campgrounds/:id/edit',  async (req, res) =>{
    const id = req.params.id
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
})

app.put('/campgrounds/:id', async (req, res) =>{
    const id = req.params.id
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    res.redirect(`/campgrounds/${id}`)
})


//* Delete campground
app.delete('/campgrounds/:id', async (req, res) =>{
    const id = req.params.id
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

app.listen(8000, () =>{
    console.log('LISTENING ON PORT 8000')
})