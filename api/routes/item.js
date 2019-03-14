const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/ItemController');
const CheckAuth = require('../middleware/check-auth');



// create redis middleware
// let redisMiddleware = (req, res, next) => {
//     let key = "__expIress__" + req.originalUrl || req.url;
//     client.get(key, function(err, reply){
//       if(reply){
//           res.send(reply);
//       }else{
//           res.sendResponse = res.send;
//           res.send = (body) => {
//               client.set(key, body);
//               res.sendResponse(body);
//           }
//           next();
//       }
//     });
//   };


router.post("/bucketlists/:id/items", CheckAuth, ItemController.addUp);
router.get("/bucketlists/:id/items", CheckAuth, ItemController.findAll );
router.get('/bucketlists/:id/items/:item', CheckAuth, ItemController.getJustOne);
router.patch('/bucketlists/:id/items/:item', CheckAuth, ItemController.update);
router.delete('/bucketlists/:id/items/:item', CheckAuth, ItemController.destroy);






module.exports = router;