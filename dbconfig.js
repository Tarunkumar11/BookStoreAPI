import mongoose from "mongoose";
import ENV from 'dotenv'

ENV.config()
async function connectDB(){    
        await mongoose.connect(process.env.DB_URI).then((result) => {
            console.log("Connected the database")
            }).catch((err) => {
            console.log("Got some errors")
        });

}

export default connectDB
