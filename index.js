import express from 'express'
import bookRouter from "./router/bookRouter.js"
import authorRouter from './router/authorRouter.js'
import authRouter from './router/authRotuer.js'
import connectDB from './dbconfig.js';
import logger from './logger.js'
import ENV from 'dotenv'

ENV.config()
const app = express()
app.use(express.json())

try{
    
    connectDB()
    logger.info("Connect to database,")
}
catch(err){
    logger.info("unable to database.")
    process.exit(1)
}


app.use("/book", bookRouter)
app.use("/auth", authRouter)
app.use("/user", authorRouter)

app.get("/", (req, res) => {
    res.send("Hello boy")
})

app.listen(process.env.PORT, () => {logger.info(`Server is listening on port no: ${process.env.PORT} `)})
