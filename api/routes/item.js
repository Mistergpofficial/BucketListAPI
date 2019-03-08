const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/ItemController');
//const redis = require('redis');
//const client = redis.createClient(process.env.REDIS_URL);
const CheckAuth = require('../middleware/check-auth');

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
router.post("/bucketlists/:id/items", CheckAuth, ItemController.addUp);
router.get("/bucketlists/:id/items", CheckAuth, redisMiddleware, ItemController.findAll );
router.get('/bucketlists/:id/items/:item', CheckAuth, redisMiddleware, ItemController.getJustOne);
router.patch('/bucketlists/:id/items/:item', CheckAuth, ItemController.update);
router.delete('/bucketlists/:id/items/:item', CheckAuth, ItemController.destroy);






module.exports = router;