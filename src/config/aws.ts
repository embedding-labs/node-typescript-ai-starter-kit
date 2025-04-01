// Config file for mongo db to connect via mongoose library

var awsConfig = {
    accessKeyId : process.env.AWS_KEY,
    secretAccesskey : process.env.AWS_SECRET_KEY,
    bucketName : process.env.AWS_BUCKET_NAME,
    region : 'ap-south-1'
};

export default awsConfig;
