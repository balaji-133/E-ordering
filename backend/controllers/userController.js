import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import validator from 'validator';

//login user

const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"user doesnot exist"})
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"invalid details"})
        }
        const token = createToken(user._id);
        res.json({success:true,token})
    }
    catch(err){
        console.log(err);
        res.json({success:false,message:"error"})
    }

}

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET);
}

//register User

const registerUser = async(req,res)=>{
    const {name,email,password} = req.body;
    try{
        //user existing check
        const exist = await userModel.findOne({email});
        if(exist){
            return res.json({success:false,message:"User already exists"});
        }
        //validating email format and strong pass
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"please enter a valid email"});
        }

        if(password.length<8){
            return res.json({success:false,message:"password must be at least 8 characters"});
        }

        //hashing user pass
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashPassword        })
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success:true,message:"User created successfully",token:token});

    }
    catch(err){
        console.log(err);
        res.json({success:false,message:"Error"})
    }
}

export {loginUser,registerUser};