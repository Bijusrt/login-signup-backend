var unirest = require("unirest");
const mongoose = require("mongoose");
const Bookshelf = require("./model");
var db = {useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex: true}
mongoose.connect("mongodb+srv://tamilthalaivas:nanbenda@5@clusterbiju-3fmrt.mongodb.net/project?retryWrites=true&w=majority",db);


const otp = async(req,res,next)=>{

    function sms (request){

        const  otp_generated = Math.floor(1000 + Math. random() * 9000);
    
        console.log(otp_generated);
    
        request.query({
            "authorization": 'N7FQj25tiDzTehCUGKJaf39yxgBSOLmAvnWp4VEdPcMoXsRlrkJkuxbojKB3TRI7GXiPNnvhdYWpCA5q',
            "sender_id": "FSTSMS",
            "message": "Your One Time Password for Tamil Thalaivas Password Reset is : "+otp_generated,
            "language": "english",
            "route": "p",
            "numbers": req.body.phone,
        });
    
        request.headers({
            "cache-control": "no-cache"
        });
    
        request.end(function (res) {
            if (res.error) throw new Error(res.error);
    
            console.log(res.body);
        });

        return otp_generated;
        
    }
    var check = await Bookshelf.find(req.body);
    if (check.length){
        req.otp_key = await sms(unirest("GET", "https://www.fast2sms.com/dev/bulk"));
        req.email = check[0].email;
        next();
    }
    else{
        res.send({msg:"Mobile no not registered"})
    }
}

module.exports = otp ; 
