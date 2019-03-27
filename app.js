const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()
const redis = require('redis');
const client = redis.createClient();
client.on("connect", function () {
    console.log("Connected to redis...");
});


//mongoose.connect(`mongodb://${config.mongo.db_connection}/${config.mongo.db_name}`, {useNewUrlParser: true})

//mongoose.connect(process.env.MONGODB_URI , {useNewUrlParser: true});
//mongoose.connect(process.env.MONGODB_URI ||  'mongodb://localhost:27017/bucket', {useNewUrlParser: true});
mongoose.connect(process.env.MONGODB_URI , {useNewUrlParser: true});
mongoose.Promise = global.Promise



app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/api/v1', require('./api/routes/user'));
app.use('/api/v1', require('./api/routes/bucketlist'));
app.use('/api/v1', require('./api/routes/item'));


//app.listen(config.port, () => console.log(`Server started at port: ${config.port}`))




module.exports = app;