import { Author } from '../models/authorModel.js'
import  mongoose from 'mongoose'
import express from 'express'
import bcrypt from "bcrypt"
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import config from 'config'
import _ from 'lodash'
import ENV from 'dotenv'

const router = express.Router()
ENV.config()

router.post('/', async (req, res) => {
    const { error }  = validateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    let author = await Author.findOne({ email:req.body.email})
    if(!author) return res.status(400).send("Invalid email or Password.")
    const validPassword = await bcrypt.compare(req.body.password, author.password)
    if( !validPassword) return res.status(400).send("Invalid email or Password.")
    const token = jwt.sign({_id: author._id},process.env.SECRET_KEY)
    res.send({token:token})
   
})  


function validateUser(author){
    const schema =Joi.object({
        email:Joi.string().required().email(),
        password:Joi.string().required(),
    })
    return schema.validate(author)
}


export default router