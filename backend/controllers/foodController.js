import foodModel from "../models/foodModel.js";
import fs from "fs";

//add food

const addFood = async(req,res)=>{
    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
    })
    try{
        await food.save();
        res.json({success:true,message:"Food added successfully"})
    }
    catch(err){
        console.log(err);
        res.json({success:false,message:"Food not added"})
    }
}

const listFood = async(req,res)=>{
    try{
        const foods = await foodModel.find({});
        res.json({success:true,data:foods})
    }
    catch(err){
        console.log(err);
        res.json({success:false,message:"Food not found"})
    }
}

//remove food
const removeFood = async(req,res)=>{
    try{
        const food = await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("File deleted successfully");
            }
        });
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Food removed successfully"})
    }
    catch(err){
        console.log(err);
        res.json({success:false,message:"Food not removed"})
    }
}

export {addFood,listFood,removeFood};