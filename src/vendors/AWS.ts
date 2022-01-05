import AWS from 'aws-sdk'
import Locals from '../providers/Locals'
AWS.config.update(
    {
        region: Locals.config().awsRegion,
        accessKeyId:  Locals.config().awsAccessKey,
        secretAccessKey:  Locals.config().awsSecretKey,
    }
)
export default AWS