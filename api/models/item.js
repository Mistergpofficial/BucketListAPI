const Mongoose = require('mongoose');
const schema = Mongoose.Schema;

const itemSchema = new schema({
    _id: Mongoose.Schema.Types.ObjectId,
    bucketlist: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: 'BucketList',
   //     required: [true, 'Bucket List is required']
    },
    item_name: {
        type: String,
      //  required: [true, 'Item Name is required']
    },
   
      createdAt: {
          type: Date,
          default: Date.now
      },
      updatedAt: {
          type: Date,
          default: Date.now
      },
      done: { type: Boolean, default: false },
});










module.exports = Mongoose.model('Item', itemSchema);