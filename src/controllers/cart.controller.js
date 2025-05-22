const asyncHandler = require("../utils/asyncHandler");
const Cart = require("../models/cart.model.js");
const ApiResponse = require("../utils/ApiResponse.js");
const mongoose = require("mongoose")

//controllers for add to cart
const addToCart = asyncHandler(async(req,res)=>{
    const{medicineId} = req.body
    if([medicineId].some((field)=> !field || field.trim()==="")){
        throw new ApiError(400,"all fields are required")
    }
    const userId = req.user?._id
    const cart = await Cart.findOne({userId:userId})
    //checking if cart is already present then add medicine
    // if selected medicine already in cart then increase quantity by 1
    // if cart is not present then create a new cart and add medicine
    if (cart){
        const itemIndex = cart.items.findIndex( (item) => item.medicine.equals(new mongoose.Types.ObjectId(medicineId)));
        
        if(itemIndex > -1){
            cart.items[itemIndex].quantity += 1
        }else{
                cart.items.push({medicine:medicineId,quantity:1})
        }
        await cart.save()
        return res
        .status(200)
        .json(
            new ApiResponse(200,cart,"item added to cart")
        )
    }else{
        const newCart = await Cart.create({
            userId:userId,
            items:[{medicine:medicineId,quantity:1}]
        })
        return res
        .status(200)
        .json(
            new ApiResponse(200,newCart,"new Cart Created")
        )
    }
})  
const getCart = asyncHandler(async(req,res)=>{
    const userId = req.user?._id
    const cart = await Cart.findOne({userId}).populate({path:"items.medicine",select: "name image price"})
    if(!cart){
        return res
        .status(200)
        .json(
            new ApiResponse(200,{},"you haven't cart anything")
        )
    }else{
        return res
        .status(200)
        .json(
            new ApiResponse(200,cart,"your cart fetched Successfully")
        )
    }
})
const deleteItem = asyncHandler(async(req,res)=>{
    const {medicineId} = req.body
    const userId = req.user?._id
    const cart = await Cart.findOne({userId})
    const refreshCart = cart.items.filter((val)=> !val.medicine.equals(new mongoose.Types.ObjectId(medicineId)) )
    
    cart.items = refreshCart
    await cart.save()
    
    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"item deleted successfully")
    )
})
module.exports = {
    addToCart,
    getCart,
    deleteItem
}