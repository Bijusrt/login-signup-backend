module.exports = {
    async validateLogin(req,res){
        var value =  await req.body;
        if (!value){ 
            res.status = 400;
            res.send ({error : "Please provide req data"})
            return;
        }
        var a = ['email','password']
        var arr = [];
        var status;
        for (var i of a){
            if (!value[i]){
                status = 422; //required
                console.log(i)    
                arr.push({error : `${i} required`})
            }
        }
        if (status){
            res.status = 400;
            res.send ({error : arr})
            return false;
        }
        if (value){
            return value;
        }
    },

    async validateSignup(req,res){
        var value =  await req.body;
        if (!value){ 
            res.status = 400;
            res.send ({error : "Please provide req data"})
            return;
        }
        var a = ['email','password','username','phone']
        var arr = [];
        var status;
        for (var i of a){
            if (!value[i]){
                status = 422; //required
                console.log(i)    
                arr.push({error : `${i} required`})
            }
        }
        if (status){
            res.status = 400;
            res.send ({error : arr})
            return false;
        }
        if (value){
            return value;
        }
    }
}   