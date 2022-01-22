import Logger from "../providers/Logger";
import { Request, Response } from "express";
import Bid from "../models/Bid";
import Product from "../models/Product";
import User  from "../models/User";
import { ObjectId } from "mongodb";
import fs from "fs";
import path from 'path'
import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
import Locals from "../providers/Locals";
const buyContractjson=JSON.parse(fs.readFileSync(path.resolve(__dirname, '../handler.json') , 'utf8'))
const token=JSON.parse(fs.readFileSync(path.resolve(__dirname, '../token.json') , 'utf8'))
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
                // Blockchain Method trasferring Token goes here
                // https://data-seed-prebsc-1-s1.binance.org:8545
                // https://matic-mumbai.chainstacklabs.com
                const provider = new HDWalletProvider(
                    'sort island camera clay tiger miss sting light scheme quit bid model',
                    'https://data-seed-prebsc-1-s1.binance.org:8545'
                  );
                const web = new Web3(provider);
                const tokenContract = new web.eth.Contract(token, Locals.config().tokenContractAddress);
                // Check if Transaction is allowed
                const allowance=await tokenContract.methods.allowance(wallet_address, Locals.config().handlerAddress).call()
                Logger.info(`Allowance is ${allowance}`)
                if(allowance.toString()<foundProduct.price.toString()+ "000000000000000000"){
                    throw new Error(`User has not authorized tranfer of tokens of amount ${foundProduct.price.toString()}`)
                }
                const buy = await tokenContract.methods.transferFrom(wallet_address,Locals.config().handlerAddress,foundProduct.price.toString() + "000000000000000000").send({from:Locals.config().handlerAddress})
                // console.log(buy)
                // Logger.debug(`After Buying ${JSON.stringify(buy)}`)
                if(buy.status){
                    const newBid=await Bid.create({user: userId, product: productId, bid_amount, wallet_address, transaction_hash: buy.transactionHash})
                    return res.status(200).json({message: 'Success, bid created', bid: newBid})
                }else{
                    throw new Error('Unable to create Bid')
                }
            }
        }catch(err){
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
    public static async viewAllBids(req: Request, res: Response){
        try{
            const {page, limit, start_time, end_time, user_id, paginate, product_id}=req.query
            const findQuery: Record<string,any> = {}
            if(product_id){
                findQuery.product= new ObjectId(product_id.toString())
            }
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
            if(paginate==='true'){
                // Set Default page as 1 and limit as 10
                const foundBids=await Bid.paginate(findQuery, {page: Number(page) || 1, limit: Number(limit) || 10 , populate:[{path: "user", select: "name _id"}, {path: "product", select: "name _id"}]})
                return res.status(200).json({message: "Success", bids: foundBids})
            }else{
                const foundBids=await Bid.find(findQuery).populate('user', 'name _id').populate('product', 'name _id bid_complete_status')
                return res.status(200).json({message: "Success", bids: foundBids})
            }
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
            const foundBid=await Bid.find({product: new ObjectId(productId.toString())}).populate({path: "user", select: "name _id"}).populate({path: "product", select: "name _id"}).sort({bid_amount: 'desc', createdAt: 'desc'}).limit(1)
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