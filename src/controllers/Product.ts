import Product from "../models/Product";
import { Request, Response } from "express";
import Logger from "../providers/Logger";
class ProductController{
    public static async addProduct(req: Request, res: Response){
        try{
            const {image_url, price, start_time, end_time, name, currency, reward}=req.body
            // Date Validations
            if(new Date()> new Date(start_time)){
                throw new Error('Current date can not be greater than start date')
            }
            if(new Date(start_time)> new Date(end_time)){
                throw new Error('End Date Can not be less than start date')
            }
            const newProduct=new Product({image_url, price, start_time, end_time, name, currency, reward})
            await newProduct.save()
            return res.status(200).json({message: "Product Added Success", product: newProduct})
        }catch(err){
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
    public static async getProductById(req: Request, res: Response){
        try{
            const {productId}=req.params
            const foundProduct=await Product.findById(productId)
            if(!foundProduct){
                throw new Error('Product Not Found')
            }
            return res.status(200).json({message: "Product Found", product: foundProduct})
        }catch(err){
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
    public static async getAllProducts(req: Request, res: Response){
        try{
            const {page, limit, start_time, end_time, paginate}=req.query
            const findQuery: Record<string,any> = {}
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
            // Set Default page as 1 and limit as 10
            let foundProducts={}
            if(paginate==='false'){
                foundProducts=await Product.find(findQuery).sort({createdAt: 'desc'})
            }else{
                foundProducts=await Product.paginate(findQuery, {page: Number(page) || 1, limit: Number(limit) || 10 })
            }
            return res.status(200).json({message: "Success", products: foundProducts})
        }catch(err){
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
    public static async deleteProductById(req: Request, res: Response){
        try{
            const {productId}=req.params
            await Product.deleteOne({_id: productId})
            return res.status(200).json({message: "Success, Product Deleted"})
        }catch(err){
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
    public static async updateProductById(req: Request, res: Response){
        try{
            const {productId}=req.params
            const foundProduct=await Product.findById(productId)
            if(!foundProduct){
                throw new Error('Product Not Found')
            }
            const {name, price, start_time, end_time}=req.body
            if(name){
                foundProduct.name=name
            }
            if(price){
                foundProduct.price=price
            }
            if(start_time){
                if(new Date(start_time)<new Date()){
                    throw new Error('Start Time Cannot be in past')
                }
                foundProduct.start_time=start_time
            }
            if(end_time){
                if(new Date(end_time)<new Date()){
                    throw new Error('End Time Cannot be in past')
                }
                if(new Date(foundProduct.start_time)>new Date(end_time)){
                    throw new Error('End Time can not be less than start Time')
                }
                foundProduct.end_time=end_time
            }
            await foundProduct.save()
            return res.status(200).json({message: "Success, Product Updated", product: foundProduct})
        }catch(err){
            Logger.error(err)
            return res.status(500).json({message: 'Server Error', error: err.message})
        }
    }
}
export default ProductController