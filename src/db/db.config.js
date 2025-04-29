require('dotenv').config()
const mongoose = require("mongoose")

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/MEDISERVE`)
        console.log("connection is successful,DB_HOST:",connectionInstance.connection.host)
    } catch (error) {
        
        console.error("error: mongoDB connection failed",error)
        process.exit(1)
    }
}

module.exports = connectDB;