// Define Products Intefrace
import mongoose from "../providers/Database"
export interface IProduct extends mongoose.Document{
    image_url: string,
    price: number,
    start_time: Date,
    end_time: Date,
    name: string,
    bid_complete_status: boolean,
    currency: string
}
export default IProduct