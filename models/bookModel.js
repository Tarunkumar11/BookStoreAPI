import mongoose from 'mongoose'
import Jwt from 'jsonwebtoken'
import Joi from "joi"

const bookSchema = mongoose.Schema({
    title:{ 
        type:String, 
        minlength:5, 
        maxlength:100, 
        required:true 
    } ,

    price:{
        type:Number,
        required:true
    },
    page_count: {
        type:Number,
        required:true
    },
    image_url: {
        type:String,
        required:false
    },

    description: {
        type:String,
        required:false,
        maxlength:300
    },
    author: {
        type:String, 
        required:true
    },
    comments:{
        type:[ String ],
        required:false
    }
})

const Book = mongoose.model("Book", bookSchema)

function validateBook(book){
    const Schema = Joi.object({
            title: Joi.string().min(5).max(100).required(),
            price:Joi.number().required(),
            page_count:Joi.number().required(),
            image_url:Joi.string().required(false),
            description: Joi.string().max(300).required(),
            author:Joi.string().required(),
            comments:Joi.array()
        })
    return Schema.validate(book)
}

export { Book, validateBook}
