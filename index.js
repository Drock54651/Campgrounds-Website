const express = require('express')
const app = express()
const path = require('path')
const AppError = require('./errorHandler')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')



const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"))
db.once("open", () =>{
    console.log("Database connected")
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))


//* Wrapper function to catch errors for async

function wrapAsync(func){
    return function(req, res, next){
        func(req, res, next).catch(err => next(err))
    }
}


//* Home Page and show all campgrounds
app.get('/', (req, res)=>{
    res.redirect('/campgrounds')
})

app.get('/campgrounds', wrapAsync(async (req, res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}))

//* Add a new campground
app.get('/campgrounds/new', (req, res) =>{
    res.render('campgrounds/new')
})

app.post('/campgrounds', wrapAsync(async (req, res) =>{
    const campground =  new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

//* Show campgrounds details
app.get('/campgrounds/:id', wrapAsync(async (req, res) =>{
    const id = req.params.id
    const campground = await Campground.findById(id)
    if(!campground){
        throw new AppError("Could not Find Campground", 401)
    }
    
    res.render('campgrounds/details', {campground})
}))


//* Edit campgrounds
app.get('/campgrounds/:id/edit', wrapAsync(async (req, res) =>{
    const id = req.params.id
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
}))

app.put('/campgrounds/:id', wrapAsync(async (req, res) =>{
    const id = req.params.id
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {runValidators: true})
    res.redirect(`/campgrounds/${id}`)
}))


//* Delete campground
app.delete('/campgrounds/:id', wrapAsync(async (req, res) =>{
    const id = req.params.id
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

//* Error Middleware
app.use((err, req, res, next) =>{
    console.log(err.name)
    const {status = 500, message = "Something Went Wrong"} = err
    console.log(`ERROR MIDDLEWARE: Error: ${message}`)
    res.status(status).send(`${message}`)

})

app.listen(8000, () =>{
    console.log('LISTENING ON PORT 8000')
})