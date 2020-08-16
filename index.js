const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
var book = require("./model");
var validater = require("./validate")
var cors=require("cors");
require('dotenv').config();
const nodemailer = require("nodemailer");
app.use(cors())
var otp = require('./otpcreate');
var db = {useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true}
mongoose.connect("mongodb+srv://tamilthalaivas:nanbenda@5@clusterbiju-3fmrt.mongodb.net/project?retryWrites=true&w=majority",db);


app.use(morgan("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));


app.get('/',(req,res)=>{
    res.send('working');   
});

app.post("/signup",async(req,res)=>{
    var result = await validater.validateSignup(req,res);
    if (result){
        var Email = await book.find({'email':result.email});    
        if (Email[0] == undefined){
            await book.create(result);
            res.send({msg:"Sucessfully signed-up!!"})
        }else{
            res.json({msg:"Oops! Email is already in use!!!"})
        }
    }
})


app.post("/login",async(req,res)=>{
    var results =await validater.validateLogin(req,res);
    console.log(results)
    Promise.resolve(results).then(async result=>{
        if (result){
            var Email = await book.find({'email':result.email});
            console.log(Email)
            if (Email.length == 0 || Email == undefined){
                res.send({msg : "Oops you are not user !!"})
            }else if(Email.length != 0 && Email[0]['password'] == result['password']){
                res.send({msg:"Sucessfully loged-in!!"})
            }else{
                res.send({msg:"Invalid password!"})
            }
        }
    }).catch(err=>{
        res.send(err);
    })
})

app.patch("/forget/password/send_otp",otp,async(req,res)=>{
    res.send({'otp': req.otp_key,'email':req.email})

})

app.patch("/forget/password/verify_otp_success",async(req,res)=>{
    var result = await book.findOneAndUpdate({'email' : req.body.email}, { $set: { password : req.body.password }},{useFindAndModify: false})
    res.send({msg : "Password Reset Success!"})
});

app.post("/mail",async (req, res) => {
    var response = req.body;
    let  otp_generated = Math.floor(1000 + Math. random() * 9000);
    var Email = await book.find({email:response.email})
    if(Email.length == 0){
        res.send({msg:"Email not registered!",otp:""})
    }else{
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
          }
        });
        var mailOptions = {
          from: process.env.EMAIL,
          to: response.email,
          subject: "PassWord Reset Email",
          text: "You One Time Password For Tamil Thalaivas App Login is : "+ otp_generated
        };
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            res.send({msg:"Sending OTP to mail failed!"})
          } else {
            res.send({'otp': otp_generated})
          }
        });
    }
});

app.use((req,res,next)=>{
    var error = new Error ("Not Found !")
    error.status = 404;
    next(error)
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500)
    res.json({
        message : error.message
    })
})

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
