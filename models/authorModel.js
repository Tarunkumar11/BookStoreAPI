import Joi from 'joi'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import ENV from "dotenv"

ENV.config()
const authorSchema = new mongoose.Schema({
    name:{ type: String, required:true, minlength:5, maxlength:30},
    email:{type: String, required:true, unique:true},
    password:{type: String, required:true},
    book:{
        type:[String]
    },
    image_url:String,
    description:{type:String, required:true, minlength:5, maxlength:300}

})

authorSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id},process.env.SECRET_KEY)
    return token
}
const Author = mongoose.model("Author", authorSchema)

function validateAuthor(author){
    const schema =Joi.object({
        name: Joi.string().min(5).max(30).required(),
        book: Joi.array(),
        email:Joi.string().required().email(),
        password:Joi.string().required(),
        image_url: Joi.string(),
        description: Joi.string().min(5).max(300).required(),
    })

    return schema.validate(author)
}


export {Author, validateAuthor}