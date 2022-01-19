import express from "express";
import path from "path";
import cors from 'cors'
import dotenv from "dotenv"
import Logger from './providers/Logger'
import morganMiddleware from './middlewares/Morgan'
import {Database} from './providers/Database'
import CronJobs from "./services/Cron";
// Importing Routes
import masterRoutes from './routes/index'
import TwilioClient from "./vendors/Twilio";
import EmailClient from "./services/Email"
import http from 'http'
import https from 'https'
import fs from 'fs'
import Locals from "./providers/Locals";
let privateKey={}
let certificate={}
let credentials={}
if(process.env.NODE_ENV==='production'){
    privateKey  = fs.readFileSync(Locals.config().SSL_CERT_PATH, 'utf8');
    certificate = fs.readFileSync(Locals.config().SSL_KEY_PATH, 'utf8');
    credentials = {key: privateKey, cert: certificate};
}

dotenv.config()
const app = express();

Database.init()
// Start All Cron Jobs
CronJobs.initCrons()
// Configure Express to use EJS
app.use(express.json({limit: '3mb'}));
app.use(express.urlencoded({ limit: '3mb', extended: true }));
app.use(morganMiddleware)
app.use(cors())
app.get( "/health", ( req, res ) => {
    // TwilioClient.sendMessageToClient('<Test Number>')
    // try{
    //     EmailClient.sendEmail('<>Test Email<>', '<h1>Email Content Goes here</h1>', 'Win Details')
    // }catch(err){
    //     console.log(err)
    // }
    return res.status(200).json({message: "Service Running"})
});

app.use('/api/v1', masterRoutes)
if(process.env.NODE_ENV==='production'){
    const server = https.createServer(credentials, app);
    // start the Express server
    server.listen( process.env.PORT, () => {
        Logger.info(`server started at https://localhost:${ process.env.PORT }`)
    } );
}else{
    app.listen( process.env.PORT, () => {
        Logger.info(`server started at http://localhost:${ process.env.PORT }`)
    } );
}
