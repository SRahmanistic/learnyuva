const mongoose = require('mongoose');
var passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  mobile:{
    type: Number,
    required: true
  },
  teachstu:{
    type: String,
    required: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});
UserSchema.plugin(passportLocalMongoose);
const User = module.exports =  mongoose.model('User', UserSchema);


