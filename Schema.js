//defining Joi Schema validation(rules)(for server side validation) //joi is a schema validator in replacement of writing multiple if conditions
const Joi = require("joi"); //require Joi package 

module.exports.listingSchema = Joi.object ({          //joi applied validation on individual field
    listing: Joi.object({                             
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),
    }).required(),
});

module.exports.reviewSchema = Joi.object ({          //joi applied validation on individual field
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});

