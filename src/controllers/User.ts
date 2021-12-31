import User from "../models/User";
import { Request, Response } from "express";
import Logger from "../providers/Logger";
class Users{
    public static async editUser(req: Request, res: Response){
        try {
            const {name, eth_address, bth_address, phone, password}=req.body
            const foundUser= await User.findById(res.locals.userId)
            if(!foundUser){
                throw new Error('User Not Found')
            }
            if(name){
                foundUser.name=name
            }
            if(eth_address){
                foundUser.eth_address=eth_address
            }
            if(bth_address){
                foundUser.bth_address=bth_address
            }
            if(phone){
                foundUser.phone=phone
            }
            if(password){
                foundUser.password=password
            }
            await foundUser.save()
            // Remove p_hash
            delete foundUser.password
            return res.status(200).json({message: 'User Updated Success', user: foundUser})
        } catch (err) {
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
    public static async getUserById(req: Request, res: Response){
        try{
            const {userId}=req.params
            const foundUser= await User.findById(userId)
            if(!foundUser){
                throw new Error('User Not Found')
            }
            return res.status(200).json({message: 'Found User Is', user: foundUser})
        }catch(err){
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
    public static async getLoggedInUser(req: Request, res: Response){
        try{
            const foundUser=await User.findById(res.locals.userId)
            return res.status(200).json({mesage: 'Succes', user: foundUser})
        }catch(err){
            Logger.error(JSON.stringify(err))
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
}
export default Users