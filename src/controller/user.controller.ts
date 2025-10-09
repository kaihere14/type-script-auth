import type { Request, Response } from "express";
import User from "../models/userSchema";
import { data } from "react-router-dom";
import jwt, { Secret } from "jsonwebtoken"
import "dotenv/config"


interface LoginRequestBody {
    username: string;
    password: string;
  }

  interface RegisterRequestBody extends LoginRequestBody {
   email:string

  }

  interface UserRequest extends Request {
    user?: string;
  }

const genAccessRefresh = async(username:string):Promise<{ accessToken: string; refreshToken: string }>=>{
const user = await User.findOne({username});
if (!user) throw new Error("User not found");
const accessToken:string =   jwt.sign({id:user.id}, process.env.ACCESS_SECRET_KEY as Secret,{expiresIn : "15m"})
console.log(accessToken)
const refreshToken:string =  jwt.sign({id:user.id}, process.env.REFRESH_SECRET_KEY as Secret,{expiresIn : "7d"} )

user.refreshToken = refreshToken
await user.save({validateBeforeSave:false})
return {accessToken,refreshToken}
}

export const registerUser = async (req: Request, res: Response) => {

  try {
    const { username,  password ,email} = req.body as RegisterRequestBody;

    
    if (!username || !email || !password) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "All fields are required"
      });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        statusCode: 409,
        success: false,
        message: "User already registered with this email"
      });
    }


    const user = await User.create({ username, email, password });
    
    return res.status(201).json({
      statusCode: 201,
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal Server Error"
    });
  }
};


export const loginUser = async(req:Request,res:Response)=>{
    const {username,password} = req.body as LoginRequestBody


    try {
        if(!username||!password){
            return res.status(400).json({status:"400",message:"All fields are required "})
        }
    
    const user =await User.findOne({username})
    if(!user){
        return res.status(409).json({status:"409",message:"No user found"})
    }
   
    const verify = await user.checkPass(password)
 
    if(!verify){
        return res.status(409).json({status:"409",message:"Invalid password"})
    }
    const {accessToken,refreshToken} = await genAccessRefresh(user?.username)

    return res.status(201).json({status:"201",user,accessToken,refreshToken,message:"Logged in successfully"})
    } catch (error) {
        return res.status(500).json({status:"500",message:"Internal server error"})
        
    }
}



export const logoutUser = async (req:UserRequest,res:Response):Promise<Response>=>{
    const id = req.user
    try {
        if(!id){
            return res.status(404).json({status:404,Message:"user id not found"})
        }
        const user = await User.findById(id)
        if(!user){
            return res.status(404).json({status:409,Message:"user not found"})
        }
        user.refreshToken = "",
        await user.save({validateBeforeSave:false})
        return res.status(200).json({status:200,message :"Logged out successfully"})
        
    } catch (error) {
        return res.status(500).json({status:500,Message:"Internal server error"})
        
    }
    
}


