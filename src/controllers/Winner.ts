import Winner from "../models/Winner";
import { Request, Response } from "express";
import Logger from "../providers/Logger";
import { ObjectId } from "mongodb";
class WinnerController{
    // This Fetches all Wins of a user or a product (which will always be one)
    public static async getAllWins(req: Request, res: Response){
        try{
            const {userId, productId, page, limit}=req.query
            const findQuery: Record<string,any> = {}
            if(userId){
                findQuery.user=new ObjectId(userId.toString())
            }
            if(productId){
                findQuery.product=new ObjectId(productId.toString())
            }
            const foundWinners=await Winner.paginate(findQuery,{page: Number(page) || 1, limit: Number(limit) || 10 , populate:[{path: 'user', select: 'name email _id'}, {path: 'product', select: 'currency price name _id'}, {path: 'bid', select: 'bid_amount createdAt _id'}] } )
            if(productId && foundWinners?.docs?.length<1){
                throw new Error('No Winner Found for this product')
            }
            return res.status(200).json({message: 'Success', winners: foundWinners})
        }catch(err){
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
}
export default WinnerController