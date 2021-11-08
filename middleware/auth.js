import  jwt from "jsonwebtoken"
import ENV from 'dotenv'

ENV.config()

function auth(req, res, next){
    const token = req.header('x-auth-token')  
    if(!token) return res.status(401).send("Access denied. No token provied")
    try{
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    }
    catch(ex){
        return res.status(400).send("Invalid-token")
    }
    

}

export default auth