const Mongoose = require('mongoose');
const Item = require('../models/item');
const BucketList = require('../models/bucketlist');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/db');

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
   }
}

exports.findAll  = (req, res) => {
    Item.find()
    .exec()
    .then(docs => {
        if(docs.length > 0){
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
            res.status(200).json(response);
        }else{
            res.status(404).json({
                message: 'No Bucket List Item is Found'
            });
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}

exports.getJustOne = (req, res) => {
    const id = req.params.item
    Item.findById(id)
    .exec()
    .then(doc => {
        if(doc){
            res.status(200).json(doc);
        }else{
            res.status(404).json('No record found');
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}


exports.update = (req, res) => {
    const id = req.params.item
    if(!req.body.item_name){
       res.status(422).json({success: false, msg: 'All Fields are required'});
    }else{
        Item.findById(id)
        .exec()
        .then(doc => {
            if(doc){
                Item.update({_id: id}, {$set: {item_name: req.body.item_name, bucketlist: req.body.bucketlist}}).then(result => {
                    if(result) {
                        res.status(200).json({
                            msg: 'Update is successful',
                            updateArray: result
                        })
                    }else{
                        res.status(404).json('Update Failed')
                    }
                })
            }else{
                res.status(500).json('No record found');
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
   }
}


exports.destroy = (req, res) =>{
    const id = req.params.item
    Item.findOneAndDelete({_id:id}, (err, result) => {
        if(result){
            res.status(200).json('Deleted')
        }else{
            res.status(404).json('Failed to delete')
        }
    })
}

// delete product by ID
exports.destroy = (req, res) => {
    const id = req.params.item;
    Item.findById(id).select('_id item_name')
    .exec()
    .then(iti => {
        if(!iti) {
            res.status(404).json({
                message: 'Item Not Found'
            });
        }
    })
   Item.remove({_id: id}).exec().then(function (result) {
      if(result){
        res.status(200).json({
            message: 'Bucketlist Deleted Successfully',
        });
      }else{
        res.status(404).json({
            message: 'Failed',
        });
      }
    }).catch(function (err) {
       console.log(err);
       res.status(500).json({
           error: err
       })
   });
}
