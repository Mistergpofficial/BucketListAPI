const Mongoose = require('mongoose');
const Item = require('../models/item');
const BucketList = require('../models/bucketlist');
const redis = require('redis');
const client = redis.createClient();



//var client = require('redis').createClient(process.env.REDIS_URL);



exports.getAll = (req, res, next) => {
    // key to store results in Redis store
    const bucketlistRedisKey = 'bucketlists';
 
    // Try fetching the result from Redis first in case we have it cached
    return client.get(bucketlistRedisKey, (err, bucketlistsFromCache) => {
 
        // If that key exists in Redis store
        if (bucketlistsFromCache) {
 
            return res.json({ source: 'cache', data: JSON.parse(bucketlistsFromCache) })
 
        } else { // Key does not exist in Redis store
 
            // Fetch directly from Bucketlist remote api
            BucketList.find()
            .select('_id bucket_list_name full_name createdAt updatedAt')
            .exec()
            .then(bucketlistsFromApi => {
 
                    // Save the  API response in Redis store,  data expire time in 3600 seconds, it means one hour
                    client.setex(bucketlistRedisKey, 3600, JSON.stringify(bucketlistsFromApi))
 
                    // Send JSON response to client
                    return res.json({ source: 'api', data: bucketlistsFromApi })
 
                })
                .catch(error => {
                    // log error message
                    console.log(error)
                    // send error to the client 
                    return res.json(error.toString())
                })
        }
    });

}




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
            //let key = "bucketlist"
            let key = "bucketlists/search" + " " + req.body.bucket_list_name;
            client.hmset(key, [
           'id' , saveBucketList._id,
           'bucket_list_name', saveBucketList.bucket_list_name,
           'full_name' , saveBucketList.full_name
        ], function(err, reply) {
            if(err){
                res.status(500).json({
                    error: err
                })
            }
            res.status(200).json({
                message: reply
            })
        });
            }else{
                res.status(500).json('Failed');
            }
        });

      
        

    }
}


// exports.getAlll = (req, res) => {
//     let perPage = 3;
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
//             nextUrl: `http://localhost:2000/api/v1/bucketlists/pagination?page=${page + 1}`
//           })

//         } else if(page === pages - 1) {
//           res.json({
//             bucketlists,
//             currentPage: page,
//             pages,
//             count,
//             prevUrl: `http://localhost:2000/api/v1/bucketlists/pagination?page=${page - 1}`,
//             nextUrl: ``
//           })
//         } else if (page > 0 && page < pages) {
//           res.json({
//             bucketlists,
//             currentPage: page,
//             pages,
//             count,
//             prevUrl: `http://localhost:2000/api/v1/bucketlists/pagination?page=${page - 1}`,
//             nextUrl: `http://localhost:2000/api/v1/bucketlists/pagination?page=${page + 1}`
//           })
//         }else {
//           res.redirect('http://localhost:2000/api/v1/bucketlists/pagination')
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

exports.search  = function(req, res) {
    let bucket_list_name = req.body.bucket_list_name;
    // key to store results in Redis store
    const bucketlistRedisKey = bucket_list_name;
 
    // Try fetching the result from Redis first in case we have it cached
    return client.get(bucketlistRedisKey, (err, bucketlistsFromCache) => {
 
        // If that key exists in Redis store
        if (bucketlistsFromCache) {
 
            return res.json({ source: 'cache', data: JSON.parse(bucketlistsFromCache) })
 
        } else { // Key does not exist in Redis store
 
            // Fetch directly from Bucketlist remote api
            BucketList.findOne({bucket_list_name: bucket_list_name})
            .exec()
            .then(obj => {
 
                    // Save the  API response in Redis store,  data expire time in 3600 seconds, it means one hour
                    client.setex(bucketlistRedisKey, 3600, JSON.stringify(obj))
 
                    // Send JSON response to client
                    return res.json({ source: 'api', data: obj })
 
                })
                .catch(error => {
                    // log error message
                    console.log(error)
                    // send error to the client 
                    return res.json(error.toString())
                })
        }
    });

   
}
