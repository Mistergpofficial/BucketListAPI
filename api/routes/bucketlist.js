const express = require('express');
const router = express.Router();
const BucketListController = require('../controllers/BucketListController');
const CheckAuth = require('../middleware/check-auth');
//const redis = require('redis');
//const client = redis.createClient();

var client = require('redis').createClient(process.env.REDIS_URL);


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