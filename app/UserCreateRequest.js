/**
 * 创建账号，并且发送消息给客户端
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
var uuid = require('uuid');
module.exports = function(data){
    var socket = this;
    var Results = rpc.Result;
    var user = db.user;
    async.waterfall([
        function(cb){
            user.findOne({email: data.email}, function(err, user){
                if(err){
                    return cb(err);
                }
                if(user){
                    if(user.pass === data.pass){
                        return cb(Results.OLD_ACCOUNT);    
                    }else{
                        return cb(Results.WRONG_PASS);
                    }
                }else{
                    return cb(null,Results.OK);
                }
            });        
        },
        function(_, cb){
            user.create({
                email: data.email,
                pass: data.pass,
                channel: data.channel,
                client_version: data.client_version,
                device_id: data.device_id,
                name: data.email,
                diamond: 100,
                blue_cost: 100,
                yellow_cost: 100,
                taskProcess: 1,
                energy: {
                    lastTime: 0,
                    value: 10
                },
                created: +new Date(),
                hero: [
                ]
            }, function(err, user){
                if(err){
                    return cb(err);
                }
                if(user){
                    console.log(user);
                    return cb(null,user[0]);
                }else{
                    return cb(new Error('system error'));
                }
            });
        }
    ], function(err, results){
        var resultCode = 1;
        if(err && typeof err === "number"){
            console.log('error code', err);
            resultCode = err;
            //return;
        }else if(err){
            console.log(err);
            //return;
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
    });
};