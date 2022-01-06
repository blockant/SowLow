import { ObjectId } from 'mongodb';
import cron from 'node-cron'
import Winner from '../models/Winner';
import Bid from "../models/Bid";
import Product from "../models/Product";
import User  from "../models/User";
import Logger from "../providers/Logger";
import TwilioClient from '../vendors/Twilio';
import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
import Email from './Email'
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
                const winner: Record<string,any>={user: leastBid[0].user, product: leastBid[0].product, bid: leastBid[0]._id}
                product.winning_bid=leastBid[0].bid_amount
                // Call Token Transfer Blockchain Method
                const provider = new HDWalletProvider(
                    'sort island camera clay tiger miss sting light scheme quit bid model',
                    'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
                  );
                const web = new Web3(provider);
                const account = await web.eth.getAccounts();
                const balanceOfAccount = await web.eth.getBalance(account[0]);
                if(web.utils.toWei(product.reward.toString())<balanceOfAccount){
                    // This will fetch the eth balance of the central wallet.
                    // Make a check that sending eth should be less than the balance of the central wallet.
                    const amountToBeSent = product.reward; // Amount to be sent to the winner
                    const resp=await web.eth.sendTransaction({
                        from: account[0], // account[0] will be the central address and will not change
                        to: leastBid[0].wallet_address,  // replace "account[1]" with the winner address
                        value: web.utils.toWei(amountToBeSent.toString()),
                    }, (err, transactionHash)=>{
                        if (err) {
                            console.log(err);
                        } else {
                            winner.reward_transaction_id=transactionHash
                            Logger.info(`Winner Transaction hash is ${transactionHash}`); // Once we receive the transaction hash, transaction is initiated and will mostly be confirmed in 15-20s 
                        }
                    });
                    console.log(resp)
                    await Winner.create(winner)
                    // Send Win Notification
                    const foundUser=await User.findById(leastBid[0].user)
                    if(foundUser.phone){
                        TwilioClient.sendMessageToClient(foundUser.phone, `Congratulations you have won the bid of product id ${product?._id} amounting ${product?.reward} ETH`)
                    }
                    // Email.sendEmail(foundUser.email, '<h1>Email Content Goes here</h1>', 'Win Details')
                    }
            }
            // Save Complete status regardless bid has been made or not during time
            product.bid_complete_status=true
            await product.save()
        }
    }catch(err){
        console.log(err)
        Logger.error(JSON.stringify(err))
    }
});

class CronJobs{
    public static initCrons(){
        winnerCron.start()
    }
}
export default CronJobs