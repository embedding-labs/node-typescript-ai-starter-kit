// Config file for mongo db to connect via mongoose library

var databaseConfig = {
    url: process.env.MONGO_URL || "",
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};

export default databaseConfig;
