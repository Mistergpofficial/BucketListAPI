const express = require('express');
const router = express.Router();
const BucketListController = require('../controllers/BucketListController');
const CheckAuth = require('../middleware/check-auth');
//const redis = require('redis');
//const client = redis.createClient(process.env.REDIS_URL);
//const jwt = require('jsonwebtoken');

//const config = require('../../config/db');

const redis = require('redis');
var rtg   = require("url").parse(process.env.REDISTOGO_URL);
const another = redis.createClient(rtg.port, rtg.hostname);
const client = another.auth(rtg.auth.split(":")[1]);



  // TODO: redistogo connection
  // var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  // var client = require("redis").createClient(rtg.port, rtg.hostname);
  // client.auth(rtg.auth.split(":")[1]);


// create redis middleware
let redisMiddleware = (req, res, next) => {
    let key = "__expIress__" + req.originalUrl || req.url;
    client.get(key, function(err, reply){
      if(reply){
          res.send(reply);
      }else{
          res.sendResponse = res.send;
          res.send = (body) => {
              client.set(key, body);
              res.sendResponse(body);
          }
          next();
      }
    });
  };





router.post("/bucketlists", CheckAuth,  BucketListController.add);
//router.get("/bucketlists/pagination", CheckAuth,  BucketListController.getAlll);
router.get("/bucketlists/", CheckAuth, redisMiddleware,  BucketListController.getAll);
router.get("/bucketlists/:id", CheckAuth, redisMiddleware, BucketListController.getOne);
router.patch("/bucketlists/:id", CheckAuth,  BucketListController.edit);
router.delete("/bucketlists/:id", CheckAuth, BucketListController.delete);




module.exports = router;