import _ from 'lodash'
import express from 'express'
import bcrypt from "bcrypt"
import logger from '../logger.js'
import authentication from '../middleware/auth.js'
import  { Author, validateAuthor } from '../models/authorModel.js'


const router = express.Router()
router.get('/me', authentication, async (req, res) =>  {
    const author = await Author.findById(req.user._id).select("-password")
    if(!author){
        logger.info(`User not found with this id: ${req.user._id}`)
        res.send({error:"User not found"})
    }
    logger.info(`User found with this id: ${req.user._id}`)
    res.send(author)
    
})

router.post('/', async (req, res) => {
    const { error }  = validateAuthor(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    let author = await Author.findOne({ email:req.body.email})
    if(author) return res.status(400).send("User already register")
    const salt = await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(req.body.password, salt)
    author = new Author(_.pick(req.body, ["name", "book", "email", "password", "image_url","description"]) )
    author = await author.save()
    const token = author.generateAuthToken()
    res.header('x-auth-token', token).send(_.pick(author, ["_id", "name", "email", "image_url"]))
})  


router.put("/", authentication, async (req, res) => {
    const { error }  = validateAuthor(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    let author = await Author.findOne({ _id:req.user._id})
    if(!author) return res.status(400).send("User does not exist.")
    const salt = await bcrypt.genSalt(10)
    req.body.password = await bcrypt.hash(req.body.password, salt)
    author.name = req.body.name
    author.book = req.body.book
    author.email = req.body.email
    author.password = req.body.password
    author.image_url = req.body.image_url
    author.description = req.body.description
    author = await author.save()
    res.send(_.pick(author, ["_id", "name","book", "email", "image_url"]))
})

router.delete("/", authentication, async (req, res) => {
    
    
    let author = await Author.findOne({ _id:req.user._id})
    if(!author) return res.status(400).send("User does not exist.")
    author = await author.delete()
    res.send(_.pick(author, ["_id", "name","book", "email", "image_url"]))
})


export default router