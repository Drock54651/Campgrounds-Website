const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const Campground = require('./models/campground')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

//! Imports from other files
const AppError = require('./utils/errorHandler')
const wrapAsync = require('./utils/wrapAsync')


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
    if(!req.body.campground){
        throw new AppError("Invalid Campground Data", 400)
    }
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


//* Error Middleware/Handling
app.all('*', (req, res, next) =>{
    next(new AppError('Page Not Found', 404))
})


app.use((err, req, res, next) =>{
    console.log(err.name)
    const {status = 500, message = "Something Went Wrong"} = err
    console.log(`ERROR MIDDLEWARE: Error: ${message}`)
    // res.status(status).send(`${message}`)
    if(!err.message){
        err.message = "Something Went Wrong!"
    }
    res.render('error', {err})

})

app.listen(8000, () =>{
    console.log('LISTENING ON PORT 8000')
})