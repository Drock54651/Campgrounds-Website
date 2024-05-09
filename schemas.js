const Joi = require('joi')

//! Reminder that the req.body object has an object campground. Joi can be used to validate the fields within the campground object
module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().required()
    }).required() //! campground object itself must also be required since thats where the data is stored to be used
});

