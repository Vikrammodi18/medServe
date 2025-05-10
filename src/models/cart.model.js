const {Schema,mongoose} = require('mongoose')

const cartSchema = Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    items:[
        {
            medicine:{
                type:Schema.Types.ObjectId,
                ref:'Medicine'
            },
            quantity:{
                type:Number,
                default:1
            }
        }
    ]
},{timestamps:true})

const Cart = mongoose.model("Cart",cartSchema)
module.exports = Cart