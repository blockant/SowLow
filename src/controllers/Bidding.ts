import Logger from "../providers/Logger";
import { Request, Response } from "express";
import Bid from "../models/Bid";
import Product from "../models/Product";
import User  from "../models/User";
import { ObjectId } from "mongodb";
class BiddingController{
    public static async createNewBid(req: Request, res: Response){
        try{
            const {productId}=req.params
            const {bid_amount, wallet_address}=req.body
            if(!wallet_address || !bid_amount){
                throw new Error('Insufficient Fields')
            }
            const userId=res.locals.userId
            const foundUser= await User.findById(userId)
            if(!foundUser){
                throw new Error('User Not Found')
            }
            const foundProduct=await Product.findById(productId)
            if(!foundProduct){
                throw new Error('Product Not Found')
            }
            // Use of Bid Price
            if(bid_amount<0){
                throw new Error('Minimum Bid Amount can not be less than 0')
            }
            if(new Date(foundProduct.start_time)> new Date()){
                throw new Error('Bid has not started yet')
            }
            if(new Date(foundProduct.end_time)< new Date()){
                throw new Error('Bid time has already passed')
            }
            // Find Least Bid for current Product
            const leastBid=await Bid.find({product: productId}).sort({bid_amount: 1}).limit(1)
            Logger.info(`Least Bid is, ${JSON.stringify(leastBid)}`)
            if(leastBid.length>0 && leastBid[0].bid_amount<=Number(bid_amount)){
                throw new Error('Following is Not Least Possible Bid')
            }else{
                // In Case It is new or valid bid
                const newBid=await Bid.create({user: userId, product: productId, bid_amount, wallet_address})
                return res.status(200).json({message: 'Success, bid created', bid: newBid})
            }
        }catch(err){
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
    public static async viewAllBids(req: Request, res: Response){
        try{
            const {page, limit, start_time, end_time, user_id}=req.query
            const {productId}=req.params
            if(!productId){
                throw new Error('Product Id is Required')
            }
            const findQuery: Record<string,any> = {}
            findQuery.product_id= new ObjectId(productId.toString())
            if(start_time){
                findQuery.start_time={
                    '$gte': start_time
                }
            }
            if(end_time){
                findQuery.end_time={
                    '$lte': end_time
                }
            }
            if(user_id){
                findQuery.user_id= new ObjectId(user_id.toString())
            }
            // Set Default page as 1 and limit as 10
            const foundBids=await Bid.paginate(findQuery, {page: Number(page) || 1, limit: Number(limit) || 10 , populate:[{path: "user", select: "name _id"}, {path: "product", select: "name _id"}]})
            return res.status(200).json({message: "Success", bids: foundBids})
        }catch(err){
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
    public static async getBidById(req: Request, res: Response){
        try{
            const {bidId}=req.params
            const foundBid=await Bid.findById(bidId).populate({path: "user", select: "name _id"}).populate({path: "product", select: "name _id"})
            if(!foundBid){
                throw new Error('No Bid Found')
            }
            return res.status(200).json({message: "Success", bid: foundBid})
        }catch(err){
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
    public static async getCurrentWinningBid(req: Request, res: Response){
        try{
            const {productId}=req.params
            // product_id=new ObjectId(product_id.toString())
            const foundBid=await Bid.find({product: new ObjectId(productId.toString())}).populate({path: "user", select: "name _id"}).populate({path: "product", select: "name _id"}).sort({bid_amount: 1}).limit(1)
            if(!foundBid || foundBid?.length<1){
                throw new Error('No Bid Found')
            }
            return res.status(200).json({message: "Success", bid: foundBid[0]})
        }catch(err){
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
}
export default BiddingController