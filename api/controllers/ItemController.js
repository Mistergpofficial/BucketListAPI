const Mongoose = require('mongoose');
const Item = require('../models/item');
const BucketList = require('../models/bucketlist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/db');
const redis = require('redis');
const client = redis.createClient();


//var client = require('redis').createClient(process.env.REDIS_URL);


exports.addUp = (req, res) => {
   if(!req.body.bucketlist_id || !req.body.item_name){
       res.status(422).json('All Fields are required')
   }else{
    const bucketlistId = req.body.bucketlist_id;
    BucketList.findById(bucketlistId).select('_id bucket_list_name')
    .exec()
    .then(bucket => {
        if(!bucket) {
            res.status(404).json({
                message: 'Bucket List Not Found'
            });
        }
    })
    const item = new Item({
            _id: Mongoose.Types.ObjectId(),
            bucketlist: req.body.bucketlist_id,
            item_name: req.body.item_name ,
            full_name: req.body.full_name
       });
       item.save ().then(result => {
           if(result) {
               res.status(200).json('Item saved to bucket list')
           }else{
               res.status(500).json('Item could not be saved')
           }
       })

       Item.find()
       .exec()
       .then(docs => {
           if(!docs){
               res.status(404).json({
                   message: 'No Bucket List Item is Found'
               });
           }else{
              const response = {
                   count: docs.length,
                   itemArray: docs.map(doc => {
                       return {
                           _id: doc._id,
                           item_name: doc.item_name,
                           bucketlist: doc.bucketlist,
                           createdAt: doc.createdAt,
                           updatedAt: doc.updatedAt,
                           done: doc.done
                       }
                   })
               }
               let key = "findAll"
               client.set(key, JSON.stringify(response));
               res.json(response);
           }
       })

   }
}

exports.findAll  = (req, res) => {
    Item.find()
    .exec()
    .then(docs => {
        if(!docs){
            res.status(404).json({
                message: 'No Bucket List Item is Found'
            });
        }else{
           const response = {
                count: docs.length,
                itemArray: docs.map(doc => {
                    return {
                        _id: doc._id,
                        item_name: doc.item_name,
                        bucketlist: doc.bucketlist,
                        createdAt: doc.createdAt,
                        updatedAt: doc.updatedAt,
                        done: doc.done
                    }
                })
            }
            let key = "findAll"
            client.set(key, JSON.stringify(response));
            res.json(response);
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}

exports.getJustOne = (req, res) => {
    let key2 = "findOne";
    const id = req.params.item
    Item.findById(id)
    .then(doc => { 
        if(!doc){
            res.status(404).json('No item for this bucket list');
        }else{
            client.set(key2, JSON.stringify(doc));
                 res.send(doc);
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}


exports.update = (req, res) => {
    const id = req.params.item
    if(!req.body.item_name){
        res.status(422).json('All Fields are required')
    }else{
    Item.findById(id)
.exec()
.then(doc => {
    if(doc){
        Item.update({_id: id}, {$set: {item_name: req.body.item_name, bucketlist: req.body.bucketlist}}).then(result => {
          if(!result){
            res.status(404).json('Update Failed')
          }else{
            Item.find()
    .exec()
    .then(docs => {
        if(!docs){
            res.status(404).json({
                message: 'No Bucket List Item is Found'
            });
        }else{
            const response = {
                count: docs.length,
                                    itemArray: docs.filter(doc => {
                                        return {
                                            _id: doc._id,
                                            item_name: doc.item_name,
                                            bucketlist: doc.bucketlist,
                                            createdAt: doc.createdAt,
                                            updatedAt: doc.updatedAt,
                                            done: doc.done
                                        }
                                    })
                            }
                let key = "findAll"
                client.set(key, JSON.stringify(response));
                 res.json(response);

                 Item.findById(id)
                    .then(doc => { 
                     if(!doc){
                         res.status(404).json('No provided entry for the given ID');
                     }else{
                        let key1 = "findOne"
                         client.set(key1, JSON.stringify(doc));
                              res.send(doc);
                     }
                 })

                 
        }
        
     });
  }
        })
    }else{
        res.status(500).json('Bucket List Not found');
    }
})
.catch(err => {
    res.status(500).json({
        error: err
    })
});
}
}




// delete bucket list item by ID
exports.destroy = (req, res) => {
    const id = req.params.item;
    Item.findById(id)
    .exec()
    .then(iti => {
        if(!iti) { 
            res.status(404).json('Bucket List Item Not Found');
        }else{
            Item.remove({_id: id}).exec().then(function (result) {
                if(!result){
                  res.status(404).json({
                      message: 'Delete Failed',
                  });
                }else{
                    Item.find()
                    .exec()
                    .then(docs => {
                        if(!docs){
                            res.status(404).json({
                                message: 'No Bucket List Item is Found'
                            });
                        }else{
                            const response = {
                                count: docs.length,
                                                    itemArray: docs.filter(doc => {
                                                        return {
                                                            _id: doc._id,
                                                            item_name: doc.item_name,
                                                            bucketlist: doc.bucketlist,
                                                            createdAt: doc.createdAt,
                                                            updatedAt: doc.updatedAt,
                                                            done: doc.done
                                                        }
                                                    })
                                            }
                                let key = "findAll"
                                client.set(key, JSON.stringify(response));
                                 res.json(response);

                                 let key1 = "findOne"
                                 client.del(key1);
                        }
                    });
                }
            });
        }
    });
}
