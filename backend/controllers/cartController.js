import userModel from '../models/userModel.js';

//add items

const addToCart = async(req, res) => {
    try {
        let userData = await userModel.findById(req.userId); // ✅ use req.userId
        let cartData = userData.cartData || {};

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(req.userId, { cartData });
        res.json({ success: true, message: "Item added to cart" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Error adding to cart" });
    }
};

const removeFromCart = async(req, res) => {
    try {
        let userData = await userModel.findById(req.userId); // ✅ use req.userId
        let cartData = userData.cartData || {};

        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
            if (cartData[req.body.itemId] === 0) {
                delete cartData[req.body.itemId];
            }
        }

        await userModel.findByIdAndUpdate(req.userId, { cartData });
        res.json({ success: true, message: "Item removed from cart" });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Error removing from cart" });
    }
};


//fetch user cart data

const getCart = async (req, res) => {
    try {
        const userData = await userModel.findById(req.userId); // ✅ use req.userId here
        const cartData = userData.cartData || {};
        res.json({ success: true, cartData });
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Failed to fetch cart" });
    }
};

export {addToCart,removeFromCart,getCart}