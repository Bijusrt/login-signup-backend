var mongoose = require('mongoose');

var Schema =    mongoose.Schema;

var signup = new Schema({
  phone:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    min:11,
    max:20,
    trim:true
  },
  username:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },
  password:{
    type:String,
    required:true,
    min:1,
    max:10,
    trim:true

  }

})

module.exports = mongoose.model("signup",signup);