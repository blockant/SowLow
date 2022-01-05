import Logger from "../providers/Logger";
import { Twilio } from "twilio";
import Locals from "../providers/Locals";
class TwilioClient{
    public static async sendMessageToClient(phone: string, message: string){
        try{
            const client=new Twilio(Locals.config().twilioAccountSid,Locals.config().twilioAuthToken)
            await client.messages.create({body: message, from: `${Locals.config().twilioNumber}`, to: `${phone}`}).then(msg => Logger.info(` Message sent ${msg.sid}`));
        }catch(err){
            Logger.error(err)
        }
    }
}
export default TwilioClient