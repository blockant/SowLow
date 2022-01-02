import User from "../models/User";
import Logger from "../providers/Logger";
import { Request, Response } from "express";
import JWT from "../providers/JWT";
class Auth{
    public static async signup(req : Request, res: Response){
        try{
            const {email, password, name, eth_address, bth_address, phone}=req.body
            if(!email || !password || !name){
                throw new Error('Insufficient Fields while Signup')
            }
            // Find Existing User
            const foundUser=await User.findOne({email})
            if(foundUser){
                throw new Error('User Already Exists')
            }
            const newUser=new User({email, password, name, eth_address, bth_address, phone})
            await newUser.save()
            return res.status(200).json({message: 'Signup Success', user: newUser})
        }catch(err){
            // tslint:disable-next-line:no-console
            console.log(err)
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
    public static async login(req: Request, res: Response){
        try{
            const {email, password}=req.body
            if(!email || !password){
                throw new Error('Insufficient Fields While Logging In')
            }
            const foundUser=await User.findOne({email})
            if(!foundUser){
                throw new Error('User with the Given Email Not Found')
            }
            if(!foundUser.authenticate(password)){
                throw new Error('Wrong Password')
            }
            // TODO: Remove Password from Response
            delete foundUser.password
            const tokenObject=JWT.issueJWT(foundUser)
            return res.status(200).json({message: 'Login Success', token: tokenObject.token, user: foundUser})
        }catch(err){
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
}

export default Auth