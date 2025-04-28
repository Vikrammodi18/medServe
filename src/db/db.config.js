const mongoose = require("mongoose")

const connectDB = async()=>{
    const instance = await mongoose.connect()

}

module.exports = connectDB;