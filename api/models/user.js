const Mongoose = require('mongoose');
const schema = Mongoose.Schema;

const userSchema = new schema({
    _id: Mongoose.Schema.Types.ObjectId,
    full_name: {
        type: String,
        required: [true, 'Full Name is required']
    },
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
       password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 character long'],
        maxlength: 100
      },
      createdAt: {
          type: Date,
          default: Date.now
      },
      updatedAt: {
          type: Date,
          default: Date.now
      },
   //   isVerified: { type: Boolean, default: false },
     is_admin: {
         type: Number
     }
});










module.exports = Mongoose.model('User', userSchema);