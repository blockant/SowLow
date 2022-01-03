import Logger from "../providers/Logger";
import { Twilio } from "twilio";
import Locals from "../providers/Locals";
class TwilioClient{
    public static async sendMessageToClient(phone: string){
        try{
            const client=new Twilio(Locals.config().twilioAccountSid,Locals.config().twilioAuthToken)
            await client.messages.create({body: 'Hi there', from: `${Locals.config().twilioNumber}`, to: `${phone}`}).then(message => Logger.info(` Message sent ${message.sid}`));
        }catch(err){
            Logger.error(err)
        }
    }
}
export default TwilioClient