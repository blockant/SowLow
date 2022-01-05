import mongoose from "../providers/Database";
import IProduct from "../interfaces/Product";
import mongoosePaginate from 'mongoose-paginate-v2'

const productSchema=new mongoose.Schema<IProduct>({
    price: {
        type: Number,
        validate: {
            validator: (value: number): boolean=>{
                return value > 0;
              },
              message: 'Price must be >0'
        },
        required: true
    },
    image_url:{
        type: String
    },
    start_time:{
        type: Date,
        required: true
    },
    end_time:{
        type: Date,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    bid_complete_status:{
        type: Boolean,
        default: false
    },
    currency:{
        type: String,
        required: true
    },
    reward:{
        type: Number,
        required: true
    }
}, {timestamps: true})

productSchema.plugin(mongoosePaginate)

interface IProductModel<T extends mongoose.Document> extends mongoose.PaginateModel<T> {}

const Product: IProductModel<IProduct> = mongoose.model<IProduct>('Product', productSchema) as IProductModel<IProduct>;
// const Product=mongoose.model<IProductModel>('Product', productSchema)

export default Product