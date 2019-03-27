const Mongoose = require('mongoose');
const schema = Mongoose.Schema;

const bucketListSchema = new schema({
    _id: Mongoose.Schema.Types.ObjectId,
    full_name: {
        type: String,
        ref: 'User',
    },
    bucket_list_name: {
        type: String,
        unique: true
     //   required: [true, 'Name Field is required']
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = Mongoose.model("BucketList", bucketListSchema);
