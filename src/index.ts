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
import TwilioClient from "./vendors/Twilio.";

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
    return res.status(200).json({message: "Service Running"})
});

app.use('/api/v1', masterRoutes)

// start the Express server
app.listen( process.env.PORT, () => {
    Logger.info(`server started at http://localhost:${ process.env.PORT }`)
} );