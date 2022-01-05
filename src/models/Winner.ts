import mongoose from "../providers/Database";
import IWinner from "../interfaces/Winner";
import mongoosePaginate from 'mongoose-paginate-v2'

const winnerSchema=new mongoose.Schema<IWinner>({
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
    bid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
        required: true
    },
    reward_transaction_id:{
        type: String
    }
}, {timestamps: true})

winnerSchema.plugin(mongoosePaginate)

interface IWinnerModel<T extends mongoose.Document> extends mongoose.PaginateModel<T> {}

const Winner: IWinnerModel<IWinner> = mongoose.model<IWinner>('Winner', winnerSchema) as IWinnerModel<IWinner>;


export default Winner