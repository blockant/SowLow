import { ObjectId } from 'mongodb';
import cron from 'node-cron'
import Winner from '../models/Winner';
import Bid from "../models/Bid";
import Product from "../models/Product";
import User  from "../models/User";
import Logger from "../providers/Logger";
import TwilioClient from '../vendors/Twilio.';

const winnerCron=cron.schedule('* * * * *', async () => {
    try{
        // Get all Products whose end date has expired
        Logger.debug('Polling data from products to get winner')
        const findQuery={
            'end_time':{
                '$lte': new Date().toISOString()
            },
            'bid_complete_status': false
        }
        const foundProducts=await Product.find(findQuery)
        // Use Promise.all to make it simpler
        for (const product of foundProducts) {
            const leastBid=await Bid.find({product: new ObjectId(product._id)}).sort({bid_amount: 1}).limit(1)
            if(leastBid?.length>0){
                await Winner.create({user: leastBid[0].user, product: leastBid[0].product, bid: leastBid[0]._id})
                // Call Token Transfer Blockchain Method

                // Send Win Notification
                const foundUser=await User.findById(leastBid[0].user)
                if(foundUser.phone){
                    TwilioClient.sendMessageToClient(foundUser.phone)
                }
            }
            // Save Complete status regardless bid has been made or not during time
            product.bid_complete_status=true
            await product.save()
        }
    }catch(err){
        Logger.error(JSON.stringify(err))
    }
});

class CronJobs{
    public static initCrons(){
        winnerCron.start()
    }
}
export default CronJobs