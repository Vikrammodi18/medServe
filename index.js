require('dotenv').config()
const app = require("./app.js")
const connectDB = require("./src/db/db.config.js")
const PORT = process.env.PORT || 8080
connectDB()
.then(()=> {
    app.listen(PORT,()=>{
        console.log(`server is runing at ${PORT}`)
    })
})