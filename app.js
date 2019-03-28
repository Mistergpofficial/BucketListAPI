const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
//const redis = require('redis');
//const client = redis.createClient();
var client = require('redis').createClient(process.env.REDIS_URL);
client.on("connect", function () {
    console.log("Connected to redis...");
});


//mongoose.connect(`mongodb://${config.mongo.db_connection}/${config.mongo.db_name}`, {useNewUrlParser: true})

//mongoose.connect(process.env.MONGODB_URI , {useNewUrlParser: true});
//mongoose.connect(process.env.MONGODB_URI ||  'mongodb://localhost:27017/bucket', {useNewUrlParser: true});
mongoose.connect(process.env.MONGODB_URI , {useNewUrlParser: true});
mongoose.Promise = global.Promise



app.all("*", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With,XMLHttpRequest");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS, PATCH");
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api/v1', require('./api/routes/user'));
app.use('/api/v1', require('./api/routes/bucketlist'));
app.use('/api/v1', require('./api/routes/item'));


//app.listen(config.port, () => console.log(`Server started at port: ${config.port}`))




module.exports = app;