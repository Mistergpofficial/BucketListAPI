const Mongoose = require('mongoose');
const Item = require('../models/item');
const BucketList = require('../models/bucketlist');
//const redis = require('redis');
//const client = redis.createClient();


var client = require('redis').createClient(process.env.REDIS_URL);



exports.add = (req, res) => {
    if(!req.body.bucket_list_name){
        res.status(422).json({
            msg: "This Field Cannot Be Blank"
        })
    }else{
        const saveBucketList = new BucketList({
            _id:  Mongoose.Types.ObjectId(),
            bucket_list_name: req.body.bucket_list_name,
            full_name: req.body.full_name
        });
        saveBucketList.save()
        .then(result => {
            if(result){
                res.status(200).json({
                    msg: 'New Bucket List Added',
                    newBucketList: result
                });
            }else{
                res.status(500).json('Failed');
            }
        });

        BucketList.find()
        .select('_id bucket_list_name full_name createdAt updatedAt')
        .exec()
        .then(bucketlists => {
            if(!bucketlists){
                res.status().json('Bucket List Not Found')
            }else{
                const response = {
                    count: bucketlists.length,
                    bucketArray: bucketlists.map(bucketlist => {
                        return {
                            _id: bucketlist._id,
                            bucket_list_name: bucketlist.bucket_list_name,
                            full_name: bucketlist.full_name,
                            createdAt: bucketlist.createdAt,
                            updatedAt: bucketlist.updatedAt
                        }
                    })
                }
                    let key = "getAll"
                    client.set(key, JSON.stringify(response));
                     res.json(response);
            }
        })

    }
}


exports.getAll = (req, res, next) => {
    let key = "getAll"
    BucketList.find()
    .select('_id bucket_list_name full_name createdAt updatedAt')
    .exec()
    .then(bucketlists => {
        if(!bucketlists){
            res.status().json('Bucket List Not Found')
        }else{
            const response = {
                count: bucketlists.length,
                bucketArray: bucketlists.map(bucketlist => {
                    return {
                        _id: bucketlist._id,
                        bucket_list_name: bucketlist.bucket_list_name,
                        full_name: bucketlist.full_name,
                        createdAt: bucketlist.createdAt,
                        updatedAt: bucketlist.updatedAt
                    }
                })
            }
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


// exports.getAlll = (req, res) => {
//   let perPage = 2;
//   let page = parseInt(req.query.page) || 0;
//   let pages = 0;
//   let nextUrl = '';
//   let prevUrl = '';
//   BucketList.count().exec(function (err, count) {
//     BucketList.find()
//       .limit(perPage)
//       .skip(perPage * page)
//       .exec(function (err, bucketlists) {
//         pages = Math.floor(count / perPage);
//         if (page === 0) {
//           res.json({
//             bucketlists,
//             currentPage: page,
//             pages,
//             count,
//             prevUrl: ``,
//             nextUrl: `http://localhost:4000/api/v1/bucketlists/?page=${page + 1}`
//           })

//         } else if (page === pages - 1) {
//           res.json({
//             bucketlists,
//             currentPage: page,
//             pages,
//             count,
//             prevUrl: `http://localhost:4000/api/v1/bucketlists/?page=${page - 1}`,
//             nextUrl: ``
//           })
//         } else if (page > 0 && page < pages) {
//           res.json({
//             bucketlists,
//             currentPage: page,
//             pages,
//             count,
//             prevUrl: `http://localhost:4000/api/v1/bucketlists/?page=${page - 1}`,
//             nextUrl: `http://localhost:4000/api/v1/bucketlists/?page=${page + 1}`
//           })
//         }else {
//           res.redirect('http://localhost:4000/api/v1/bucketlists/')
//         }

//       });
//   });
// }

exports.getOne = (req, res) => {
    let key = "getOne";
    const id = req.params.id
    BucketList.findById(id)
    .select('_id bucket_list_name full_name createdAt updatedAt')
    .then(bucketlist => { 
        if(!bucketlist){
            res.status(404).json('No provided entry for the given ID');
        }else{
            client.set(key, JSON.stringify(bucketlist));
                 res.send(bucketlist);
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    })
}

exports.edit = (req, res, next) => {
    const id = req.params.id
    if(!req.body.bucket_list_name){
        res.status(422).json('All Fields are required')
    }else{
    BucketList.findById(id)
.exec()
.then(bucketlist => {
    if(bucketlist){
        BucketList.update({_id: id}, {$set: {bucket_list_name: req.body.bucket_list_name}}).then(result => {
          if(!result){
            res.status(404).json('Update Failed')
          }else{
            BucketList.find()
    .select('_id bucket_list_name full_name createdAt updatedAt')
    .exec()
    .then(bucketlists => {
        if(!bucketlist){
            res.status(404).json({
                message: 'No Bucket List is Found'
            });
        }else{
            const response = {
                count: bucketlists.length,
                bucketArray: bucketlists.map(bucketlist => {
                    return {
                        _id: bucketlist._id,
                        bucket_list_name: bucketlist.bucket_list_name,
                        full_name: bucketlist.full_name,
                        createdAt: bucketlist.createdAt,
                        updatedAt: bucketlist.updatedAt
                    }
                })
            }
                let key = "getAll"
                client.set(key, JSON.stringify(response));
                 res.json(response);

                 BucketList.findById(id)
                 .select('_id bucket_list_name full_name createdAt updatedAt')
                 .then(bucketlist => { 
                     if(!bucketlist){
                         res.status(404).json('No provided entry for the given ID');
                     }else{
                        let key1 = "getOne"
                         client.set(key1, JSON.stringify(bucketlist));
                              res.send(bucketlist);
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
// delete bucket list by ID
exports.delete = (req, res) => {
    const id = req.params.id;
    BucketList.findById(id).select('_id bucket_list_name')
    .exec()
    .then(bucki => { 
        if(!bucki){
            res.status(404).json('Bucket List Not Found');
        }else{
            BucketList.remove({_id: id}).exec().then(function (result) { 
                if(!result){
                    res.status(404).json({
                        message: 'Failed',
                    }); 
                }else{
                    Item.remove({bucketlist: id}).exec().then(resul => { 
                        if(!resul){
                            res.status(404).json({
                                message: 'Failed',
                            });  
                        }else{
                            BucketList.find()
                            .select('_id bucket_list_name full_name createdAt updatedAt')
                            .exec()
                            .then(bucketlists => {
                                if(!bucketlists){
                                    res.status().json('Bucket List Not Found')
                                }else{ 
                                    const response = {
                                        count: bucketlists.length,
                                        bucketArray: bucketlists.map(bucketlist => {
                                            return {
                                                _id: bucketlist._id,
                                                bucket_list_name: bucketlist.bucket_list_name,
                                                full_name: bucketlist.full_name,
                                                createdAt: bucketlist.createdAt,
                                                updatedAt: bucketlist.updatedAt
                                            }
                                        })
                                    }
                                    let key = "getAll"
                                    client.set(key, JSON.stringify(response));
                                     res.json(response);
    
                                     let key1 = "getOne"
                                     client.del(key1);
                                } 
                            });




                        }
                    });
                }
            });
        }
    });
     
}

exports.search = (req, res) => {
   var query = {};
   if(req.query.bucketListQuery){
       query.bucket_list_name = { "$regex": req.query.bucketListQuery, "$options": "i"};
   }
   BucketList.find(query, function(err, result){
       if(err){
           res.status(500).json("Not a valid search");
       }else{
           res.json(result)
       }
   })
}