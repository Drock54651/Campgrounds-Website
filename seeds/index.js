
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"))
db.once("open", () =>{
    console.log("Database connected")
})

//! get a random element from an array, in this case from descriptors and places 
const sample = (arr) =>{
    return arr[Math.floor(Math.random() * arr.length)]
}



//! clear out database
//! insert 50 cities each with descriptor and place
const seedDB = async () =>{
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++){
        const randomCity = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 100)
        const camp = new Campground({
            location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251",
            description: "Placeholder description",
            price: price
        })
        await camp.save()
    }
}

seedDB().then(() =>{
    mongoose.connection.close()
})