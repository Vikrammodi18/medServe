const {mongoose,Schema} = require('mongoose')

const orderSchema = new Schema({
    address:{
        type:String,
    },
    totalAmount:{
        type:Number,
        required:true
    },
    userName:{
        type:String,
        required:true,
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    items:[
        {
            medicine:{
                type:Schema.Types.ObjectId,
                ref:"Medicine"
            },
            quantity:{
                type: Number,
                required: true,
                
            }
        }
    ],
    orderDate:{
        type: Date, 
    },
    orderState:{
        type:String,
        enum:["pending","confirm","on the way","delivered","cancel"],
        default:"pending"
    }
})

const Order = mongoose.model("Order",orderSchema)

module.exports = Order
