// Define Products Intefrace
import mongoose from "../providers/Database"
export interface IWinner extends mongoose.Document{
    user: mongoose.Types.ObjectId,
    product: mongoose.Types.ObjectId,
    bid: mongoose.Types.ObjectId,
    reward_transaction_id: string
}
export default IWinner