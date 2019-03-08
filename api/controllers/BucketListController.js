const Mongoose = require('mongoose');
const Item = require('../models/item');
const BucketList = require('../models/bucketlist');


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

    }
}


exports.getAll = (req, res) => {
    BucketList.find()
    .select('_id bucket_list_name full_name createdAt updatedAt')
    .exec()
    .then(bucketlists => {
        if(bucketlists.length > 0){
            const response = {
                count: bucketlists.length,
                bucketArray: bucketlists.filter(bucketlist => {
                    return {
                        _id: bucketlist._id,
                        name: bucketlist.name
                    }
                })
            }
            res.status(200).json(response);
        }else{
            res.status(404).json({
                message: 'No Bucket List is Found'
            });
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
    const id = req.params.id
    BucketList.findById(id)
    .select('_id bucket_list_name full_name createdAt updatedAt')
    .then(bucketlist => {
        if(bucketlist){
            res.status(200).json(bucketlist);
        }else{
            res.staus(404).json('No provided entry for the given ID')
        }
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
}

exports.edit = (req, res) => {
    const id = req.params.id
    if(!req.body.bucket_list_name){
        res.status(422).json('All Fields are required')
    }else{
        BucketList.findById(id)
        .exec()
        .then(bucketlist => {
            if(bucketlist){
                BucketList.update({_id: id}, {$set: {bucket_list_name: req.body.bucket_list_name}}).then(result => {
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


// delete product by ID
exports.delete = (req, res) => {
    const id = req.params.id;
    BucketList.findById(id).select('_id bucket_list_name')
    .exec()
    .then(bucki => {
        if(!bucki) {
            res.status(404).json({
                message: 'Bucket List Not Found'
            });
        }
    })
   BucketList.remove({_id: id}).exec().then(function (result) {
      if(result){
          Item.remove({bucketlist: id}).exec().then(resul => {
              if(resul){
                res.status(200).json({
                    message: 'Bucketlist Deleted Successfully',
                });
              }else{
                res.status(404).json({
                    message: 'Failed',
                }); 
              }
          })
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