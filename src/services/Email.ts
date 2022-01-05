import { debug } from 'console';
import Logger from '../providers/Logger';
import AWS from '../vendors/AWS'
class Email{
    public static async sendEmail(to: string|string[], body: string, subject: string){
        if(!Array.isArray(to)){
            to=[to]
        }
        const params = {
            Destination: {
              ToAddresses: to
            },
            Message: {
              Body: {
                Html: {
                 Charset: "UTF-8",
                 Data: `${body}`
                }
               },
               Subject: {
                Charset: 'UTF-8',
                Data: `${subject}`
               }
              },
            Source: 'SENDER_EMAIL_ADDRESS'
          };
          // Create the promise and SES service object
          const sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();
          return await sendPromise
                .then((data)=>{
                        Logger.info(`Email Message Id id ${data.MessageId}`)
                        return {
                            success: true,
                            message: 'email has been sent'
                        }
                    })
                .catch(
                     (err)=>{
                        // console.error(err, err.stack);
                        Logger.error(err)
                        return {
                            success: false,
                            message: 'unable to send email',
                            error: err.toString()
                        }
                    })
    }
};
export default Email