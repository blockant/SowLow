// Define Products Intefrace
import mongoose from "../providers/Database"
export interface IBid extends mongoose.Document{
    user: mongoose.Types.ObjectId,
    product: mongoose.Types.ObjectId,
    bid_amount: number,
    wallet_address: string,
    transaction_id: string
}
export default IBid