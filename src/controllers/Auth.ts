import User from "../models/User";
import Logger from "../providers/Logger";
import { Request, Response } from "express";
class Auth{
    public static async signup(req : Request, res: Response){
        try{
            const {email, password, name}=req.body
            if(!email || !password || !name){
                throw new Error('Insufficient Fields while Signup')
            }
            // Find Existing User
            const foundUser=await User.findOne({email})
            if(foundUser){
                throw new Error('User Already Exists')
            }
            const newUser=new User({email, password, name})
            await newUser.save()
            return res.status(200).json({message: 'Signup Success', user: newUser})
        }catch(err){
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
    public static async login(req: Request, res: Response){
        try{
            return res.status(200).json({message: 'Login Success'})
        }catch(err){
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
}

export default Auth