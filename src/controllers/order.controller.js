const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const placedOrder = asyncHandler(async(req,res)=>{
    const {userName,totalAmount,address} = req.body
    const userId = req.user?._id
    if([userName,totalAmount,address].some((val)=> !val || val.trim()==="")){
        throw new ApiError(400,"required fields")
    }
   
    const cart = await Cart.findOne({userId}).populate({path:"items.medicine"})
    
    if(!cart || cart.items.length ===0){
        throw new ApiError(400,"Cart is empty")
    }
    let tAmount = 0
    let deliveryCharge = 50
    const items = cart.items.map((item) =>{
        let price = item.medicine.price
        tAmount += (price* item.quantity) 
        return {

            medicine:item.medicine,
            quantity: item.quantity
        }
    })
    tAmount += deliveryCharge
    // console.log("tAmount",tAmount,", totalAmount",totalAmount)
    if(tAmount != totalAmount){
        throw new ApiError(400,"recheck total amount")
    }
    const order = await Order.create({
        userId,
        userName,
        totalAmount,
        address,
        items,
        orderDate: new Date()
       
    })
    cart.items = [];
    await cart.save();
    return res
    .status(201)
    .json(
        new ApiResponse(201,order,"order placed successfully")
    )
})
const getOrderDetails = asyncHandler(async (req,res)=>{
    const userId = req.user?._id
    const totalOrder = await Order.find({userId}).populate({path:"items.medicine"})
    return res
    .status(200)
    .json(
        new ApiResponse(200,totalOrder,"fetched all order data")
    )
})
module.exports = {placedOrder,getOrderDetails}