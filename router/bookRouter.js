import express from 'express'
import mongoose from "mongoose"
import { Book, validateBook} from '../models/bookModel.js'
import auth from '../middleware/auth.js'
import  _ from "lodash"

const router = express.Router()
router.get("/", async (req, res) => {
    try{
        const book = await Book.find().select("-_id")
        // req.log.info("Getting the all books from database")
        res.send(book)

    }catch(error){
        res.status(500).send(error)
    }
})

router.post("/", auth, async (req, res) => {
    const { error }  = validateBook(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    let book  = new Book(_.pick(req.body, ["title", "price", "page_count", "image_url","description", "author", "comments"]) )
    book = await book.save()
    res.send(_.pick(book, ["title", "price", "page_count", "page_count", "image_url","description", "author", "comments"]))
})



router.put("/:id",auth, async (req, res) => {
    const { error }  = validateBook(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    let book = await Book.findById(req.params.id)
    if(!book) return res.status(400).send("Book does not exist with this id")
    book.title = req.body.title
    book.price = req.body.price
    book.page_count = req.body.page_count
    book.image_url = req.body.image_url
    book.description = req.body.description
    book.author  = req.body.author
    book.comments = req.body.comments
    book = await book.save()
    res.send(_.pick(book, ["title", "price", "page_count", "page_count", "image_url","description", "author", "comments"]))
})

router.delete("/:id",auth, async (req, res) => {

    try{
        let book = await Book.findById(req.params.id)
        book = await book.delete()
        res.send(book)
    }
    catch(error){
        return res.status(400).send({error: "Invalid book-id"})
    }
    
})

export default router




