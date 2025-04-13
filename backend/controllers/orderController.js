// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// //ordering from website

// const placeOrder = async(req,res)=>{

//     const frontEnd_url = "http://localhost:5173";
//     try{
//         const newOrder = new orderModel({
//             userId: req.body.userId,
//             items:req.body.items,
//             amount:req.body.amount,
//             table:req.body.table,
//             people:req.body.people,
            
//         })
//         await newOrder.save();
//         await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
//         const line_items = req.body.items.map((item)=>({
//             price_data:{
//                 currency: "inr",
//                 product_data:{
//                     name:item.name
//                 },
//                 unit_amount:item.price*100*80
//             },
//             quantity:item.quantity
//         }))
//         line_items.push({
//             price_data:{
//                 currency:"inr",
//                 product_data:{
//                     name:"Delivery charges"
//                 },
//                 unit_amount:2*100*80
//             },
//             quantity:1
//         })
//         const session = await stripe.checkout.sessions.create({
//             line_items:line_items,
//             mode:"payment",
//             success_url: `${frontEnd_url}/verify?success=true&orderId=${newOrder._id}`,
//             cancel_url: `${frontEnd_url}/verify?success=false&orderId=${newOrder._id}`
//         })
//         res.json({success:true,session_url:session.url})
//     }
//     catch(err){
//         console.log(err)
//         res.json({success:false,message:"Error"})
//     }
// }

// export {placeOrder};
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import jwt from 'jsonwebtoken';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
    const frontEnd_url = process.env.FRONTEND_URL || "http://localhost:5173";
    
    try {
        // Verify and decode the token to get user ID
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Validate required fields
        const { items, amount, name, table, people } = req.body;
        
        if (!items || !amount || !name || !table || !people) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: items, amount, name, table, people"
            });
        }

        // Create new order
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            name,
            table,
            people
        });

        await newOrder.save();

        // Clear user's cart using the proper user ID
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        // Prepare Stripe line items
        const line_items = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: Math.round(item.price * 100)
            },
            quantity: item.quantity
        }));

        // Add delivery charges
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery charges"
                },
                unit_amount: 2 * 100
            },
            quantity: 1
        });

        // Create Stripe session
        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${frontEnd_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontEnd_url}/verify?success=false&orderId=${newOrder._id}`,
            metadata: {
                orderId: newOrder._id.toString(),
                userId: userId
            }
        });

        res.json({
            success: true,
            session_url: session.url
        });

    } catch (err) {
        console.error("Order Error:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Internal server error"
        });
    }
};

const verifyOrder = async(req,res)=>{
    const {orderId,success}=req.body;
    try{
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true,message:"payment successful"});
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"payment Not successful"});
        }
    }
    catch(err){
        console.log(err)
        res.json({success:false,message:"Error"});
    }

}

//userorder

const userOrders = async(req,res)=>{
    try{
        // Verify and decode the token to get user ID
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const orders = await orderModel.find({userId: userId});
        res.json({success:true,data:orders});
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false,message:"Error fetching orders"});
    }
}

//listing orders for admiin panel

const listOrders = async(req,res)=>{
    try{
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } catch(err){
        console.log(err);
        res.json({success:false,message:"error"})
    }
}

//api updating order status

const updateStatus = async(req,res) => {
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true,message:"status updated"})
    }
    catch(err){
        console.log(err);
        res.json({success:false,message:"Error updating status"})
    }
}

export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus };