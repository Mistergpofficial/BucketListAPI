const Mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/db');
const randtoken = require('rand-token');



exports.create = (req, res) => {
    const email = req.body.email;
    if(!req.body.full_name || !req.body.username || !req.body.email || !req.body.password){
        res.status(422).json('All Fields are required');
    }else{
        User.findOne({email: email}, (err, user) => {
            if(err){
                res.status(409).json('Mail Already Exists')
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err){
                        res.status(500).json({
                            error: err
                        });
                    }else{
                        const newUser = new User({
                            _id: Mongoose.Types.ObjectId(),
                            full_name: req.body.full_name,
                            username: req.body.username,
                            email: req.body.email,
                            password: hash,
                        });
                        newUser.save().then(result => {
                            if(result){
                                res.status(200).json({
                                    msg: 'User Saved',
                                    userDetails: result
                                })
                            }else{
                                res.status(401).json({
                                    error: 'Error Saving Data'
                                });
                            }
                        });
                    }
                });
            }
        })
    }
}

exports.add = (req, res) => {
    if (!req.body.email || !req.body.password) {
        res.status(422).json('All Fields are required');
    } else {
  User.findOne({email: req.body.email}, function (err, user) {
      if(user < 1)
        return res.status(401).json(
           'Email Doesnt Exist'
        );
        var plainPassword = req.body.password;
        var hashedPassword = user.password;
        bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
              if(err){
                return res.status(401).json('Auth Failed');
            }

        
              if(isMatch){
                const payload ={
                    _id:user.id,
                    full_name: user.full_name,
                    username: user.username,
                    email: user.email,
                };
                let token = jwt.sign(payload, `${config.secret}`,{
                    expiresIn:"1h"
                });
                var refreshToken = randtoken.uid(256) 
             //   refreshTokens[refreshToken] =   res.json({token: token, refreshToken: refreshToken, user: payload}) 
                return res.status(200).json({
                    message: 'Auth Successful',
                    token: token,
                    refreshToken: refreshToken,
                    user: payload
                });
            }
               
               res.status(401).json('Authentication Failed');
            });
        });
    }
}


// exports.refreshToken = (req, res) => {

// }