/**
 * 用户登录请求
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
module.exports = function(data){
    var socket = this;
    var Results = rpc.Result;
    var user = db.user;
    async.waterfall([
        function(cb){
            user.findOne({$or:[
                {device_id: data.device_id}
            ]}, function(err, user){
                if(err){
                    return cb(err);
                }
                if(user){
                    if(user.pass === data.pass && user.email === data.email){
                        return cb(null, user);    
                    }else if(user.email === data.email){
                        return cb(Results.WRONG_PASS);
                    }else{
                        return cb(Results.BINDED);
                    }
                }else{
                    return cb(Results.NO_ACCOUNT);
                }
            });        
        }
    ], function(err, results){
        var resultCode = 1;
        if(err && typeof err === "number"){
            console.log('error code', err);
            resultCode = err;
        }else if(err){
            console.log(err);
        }else{
            resultCode = 0;    
        }
        var UserCreateReply = new rpc.UserCreateReply({
            result: resultCode
        });
        var dataBuffer = UserCreateReply.toBuffer();
        var TransUnit = new rpc.TransUnit({
            cmd:"USER_CREATE_REPLY",
            data: dataBuffer,
            flags: 1,
            usn: 1
        });
        console.log(TransUnit.toBuffer());
        socket.write(TransUnit.toBuffer());
        delete results.created;
        results.energy.left_seconds = 0;
        delete results.energy.lastTime;
        delete results.email;
        delete results.pass;
        delete results.channel;
        delete results.device_id;
        results.id = results._id;
        delete results._id;
        console.log(results);
    });
};