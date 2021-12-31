import mongoose from "../providers/Database";
import IBid from "../interfaces/Bid";
import mongoosePaginate from 'mongoose-paginate-v2'

const bidSchema=new mongoose.Schema<IBid>({
    bid_amount:{
        type: Number,
        validate: {
            validator: (value: number): boolean=>{
                return value > 0;
              },
              message: 'Bid Amount must be >0'
        },
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    wallet_address: {
        type: String,
        required: true
    }
}, {timestamps: true})

bidSchema.plugin(mongoosePaginate)

interface IBidModel<T extends mongoose.Document> extends mongoose.PaginateModel<T> {}

const Bid: IBidModel<IBid> = mongoose.model<IBid>('Bid', bidSchema) as IBidModel<IBid>;


export default Bid